import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new Error('Credenciais');
    const ok = await bcrypt.compare(body.password, user.password);
    if (!ok) throw new Error('Credenciais');
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { access_token: token };
  }
}
