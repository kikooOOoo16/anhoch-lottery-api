import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(email: string, firstName: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to the Anhoch Lottery App',
      template: 'verify-account-email.template.hbs',
      context: {
        url,
        firstName,
      },
    });
  }

  async sendResetPasswordEmail(email: string, url: string, name = '') {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      template: 'reset-account-password.template.hbs',
      context: {
        url,
        name,
      },
    });
  }
}
