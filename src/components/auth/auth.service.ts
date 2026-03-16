import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { TeacherRole } from '../../modules/teacher/enums/teacher-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Teacher') private readonly teacherModel: Model<any>,
    @InjectModel('School') private readonly schoolModel: Model<any>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingTeacher = await this.teacherModel
      .findOne({ email: dto.email })
      .lean();
    if (existingTeacher) {
      throw new ConflictException('Email already registered');
    }

    const school = await this.schoolModel.create({
      name: dto.schoolName,
      address: dto.schoolAddress,
      phone: dto.schoolPhone,
    });

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const admin = await this.teacherModel.create({
      schoolId: school._id,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: TeacherRole.ADMIN,
    });

    const token = this.generateToken(admin, school._id.toString());
    return { token, user: this.sanitize(admin), school };
  }

  async login(dto: LoginDto) {
    const teacher = await this.teacherModel
      .findOne({ email: dto.email, isActive: true })
      .lean();

    if (!teacher) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      teacher.passwordHash,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(teacher, teacher.schoolId.toString());
    return { token, user: this.sanitize(teacher) };
  }

  private generateToken(teacher: any, schoolId: string): string {
    const payload = {
      sub: teacher._id.toString(),
      role: teacher.role,
      schoolId,
      email: teacher.email,
    };
    return this.jwtService.sign(payload);
  }

  private sanitize(teacher: any) {
    const { passwordHash: _, ...safe } = teacher;
    return safe;
  }
}
