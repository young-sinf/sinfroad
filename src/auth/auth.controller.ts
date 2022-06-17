import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { GoogleUser } from '../@types/user';
import { JwtPayload } from '../@types/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleRedirect() {
    // redirect google login
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = await this.userService.findByProviderIdOrSave(
      req.user as GoogleUser,
    );

    const payload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } = this.authService.getToken(payload);

    res.cookie('access-token', accessToken);
    res.cookie('refresh-token', refreshToken);

    // FIXME: Fix redirect url
    res.redirect('/');
  }
}
