import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // This function will create user
  async create(createAuthDto: CreateAuthDto) {
    try {
      const existingUser = await this.prisma.credential.findUnique({
        where: {
          email: createAuthDto.email,
        },
      });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const { password } = createAuthDto;
      const hasshedPassword = await bcrypt.hash(password, 10);
      const credential = await this.prisma.credential.create({
        data: {
          email: createAuthDto.email,
          password: hasshedPassword,
          firstName: createAuthDto.firstName,
          lastName: createAuthDto.lastName,
        jurisdiction: createAuthDto.jurisdiction,
          phone: createAuthDto.phone,
        },
      });
      return credential;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // This function for login user
  async login(loginDto: LoginDTO) {
    const { email, phone, password } = loginDto;

    try {
      // --- Find user by email OR phone ---
      const user = await this.prisma.credential.findFirst({
        where: {
          OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.isApproved === false) {
        throw new HttpException(
          'Your account is not approved please contact to admin',
          HttpStatus.NOT_FOUND,
        );
      }
      // --- Check password ---
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      // --- Build JWT payload ---
      const payload = {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      // --- Exclude password before returning ---
      const { password: _, ...safeUser } = user;

      return { accessToken, user: safeUser };
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //forget-password
  async forgetPassword(email: string) {
    const user = await this.prisma.credential.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Set the expiration time to 10 minutes from now
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update the user's record with the new OTP and its expiration time
    await this.prisma.credential.update({
      where: { email },
      data: {
        resetToken: otp,
        resetTokenExpiresAt: otpExpiresAt,
      },
    });

    // Send the OTP to the user's email
    await this.mailService.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<h1>Password Reset Request</h1>:
    Your OTP : ${otp}`,
      from: process.env.SMTP_USER as string,
    });

    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(verificationToken: string, newPassword: string) {
    const user = await this.prisma.credential.findFirst({
      where: {
        verificationToken: verificationToken,
        verificationTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new HttpException(
        'Invalid or expired verification token',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the verification token
    await this.prisma.credential.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  async verifyOTP(otp: number) {
    const user = await this.prisma.credential.findFirst({
      where: {
        resetToken: otp,
        resetTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    // Generate a temporary verification token (e.g., a long random string)
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store the verification token in the user's record
    await this.prisma.credential.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiresAt: null,
        verificationToken: verificationToken,
        verificationTokenExpiresAt: verificationTokenExpiresAt,
      },
    });

    // Return the token to the frontend
    return {
      message: 'OTP verified successfully',
      verificationToken: verificationToken,
    };
  }

  async resetUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.credential.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 2. Compare the provided old password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

    // 3. Hash the new password and update the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.credential.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password updated successfully' };
  }

  async createSuperAdmin() {
    try {
      const existingUser = await this.prisma.credential.findUnique({
        where: {
          email: 'admin@gmail.com',
        },
      });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const hasshedPassword = await bcrypt.hash('admin123', 10);
      const credential = await this.prisma.credential.create({
        data: {
          email: 'admin@gmail.com',
          password: hasshedPassword,
          firstName: 'SUPER_admin',
          lastName: 'admin',
          role: 'SUPER_ADMIN',
          phone: '123456789023',
          isApproved: true,
        },
      });
      return credential;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
