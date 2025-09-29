import { HttpException, Injectable } from '@nestjs/common';
import { UpdateCredentialDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TUser } from 'src/types/user';
import * as fs from 'fs/promises';
import * as path from 'path';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Retrieves the profile of the currently authenticated user.
  async getMe(user: Partial<TUser>) {
    try {
      const profile = await this.prisma.credential.findUnique({
        where: {
          id: user.userId,
        },
      });

      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Updates the profile of the currently authenticated user.
  async updateProfile(
    user: { userId: string },
    updateCredentialDto: UpdateCredentialDto,
    image?: Express.Multer.File,
  ) {
    try {
      let imageUrl: string | undefined;

      if (image) {
        try {
          const uploadDir = path.join(process.cwd(), 'uploads');
          await fs.mkdir(uploadDir, { recursive: true });

          const filename = `${user.userId}-${Date.now()}${path.extname(
            image.originalname,
          )}`;
          const filePath = path.join(uploadDir, filename);

          await fs.writeFile(filePath, image.buffer);

          imageUrl = `${process.env.BASE_URL}/uploads/${filename}`;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Re-throw as an HttpException to be caught by the outer try/catch
          throw new HttpException('Image upload failed', 500);
        }
      }

      const { notification, emargencyAlert, ...restDto } = updateCredentialDto;
      
      const profile = await this.prisma.credential.update({
        where: {
          id: user.userId,
        },
        data: {
          ...restDto,
          image: imageUrl,
          notification: notification ? notification === 'true' : undefined,
          emargencyAlert: emargencyAlert ? emargencyAlert === 'true' : undefined,
        },
      });

      return profile;
    } catch (error) {
      // It's good practice to re-throw the error to be handled by the controller
      throw new HttpException(error.message, error.status);
    }
  }

  async getRecentActivity(id:string){
    try{
        const [reports] = await Promise.all([
          this.prisma.incidentReport.findMany({
            where:{
              userId: id
            },
            orderBy:{
              createdAt: 'desc'
            },
            include:{
              user: true
            },
            take:1
          }),
          
        ]);
        return reports;
    }catch(error){
      throw new HttpException(error.message, error.status)
    }
  }
}
