import puppeteer from 'puppeteer';
import invariant from 'tiny-invariant';
import { injectable } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { MeteorInternalServerError } from '@infra/meteor/errors/meteor-internal-server.error';

@injectable()
export class TestMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.TestOpenresa]: async () => {
        const browser = await puppeteer.launch({ headless: true });

        try {
          const page = await browser.newPage();

          await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          );

          await page.goto('https://openresa.com/club/socialmontegrande', {
            waitUntil: 'networkidle2',
          });

          const csrfToken = await page.$eval(
            'input[name="csrf_auth_login9849"]',
            (node) => node.getAttribute('value'),
          );

          console.log(csrfToken);

          invariant(csrfToken);

          const cookies = await page.cookies();

          const loginResponse = await fetch(
            'https://openresa.com/auth/login/from/club-home',
            {
              body: new URLSearchParams({
                club_id: '9849',
                cookie_enabled: 'true',
                csrf_auth_login9849: csrfToken,
                password: '123',
                remember: '1',
                username: 'Admin admin',
              }).toString(),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
            },
          );

          console.log(JSON.stringify(await loginResponse.json(), null, 2));
        } catch (error) {
          console.error(error);

          throw new MeteorInternalServerError();
        } finally {
          await browser.close();
        }
      },
    });
  }
}
