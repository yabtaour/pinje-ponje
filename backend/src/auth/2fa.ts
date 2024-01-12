import * as otplib from 'otplib';

async function generateTwoFactorSecret(user: any) {
    const secret = otplib.authenticator.generateSecret();
    const otpauth = otplib.authenticator.keyuri(user.email, 'pinjePonge', 'secret');
}
