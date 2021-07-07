import got from "got";
import * as FormData from 'form-data';
import { Inject, Injectable } from "@nestjs/common";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { EmailVar, MailModuleOptions } from "./mail.interfaces";


@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    // this.sendEmail('testing', 'test');
  }

  private async sendEmail(
    subject: string,
    // to: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from',
    `David from Dsuber Eats <mailgun@${this.options.emailDomain}>`,
    );
    form.append('to', `dsbnb2021@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((variable) =>
      form.append(`v:${variable.key}`, variable.value));
    try {
      await got(
        `https://api.mailgun.net/v3/${this.options.emailDomain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      // console.log(response.body);
    } catch (err) {
      console.log(err);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}