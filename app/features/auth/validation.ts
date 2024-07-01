import * as v from "valibot";
import { messages } from "./messages";

const specialSymbols =
  "!@#$%^&*\\u0028\\u0029_\\u002D+=\\u007D\\u007B\\u005B\\u005D\\u007C:;\\u0022\\u0027<>,.?\\u002F\\u005C\\u0060~";
const minLength = 8;
const maxLength = 40;

const oneLowercase = "(?=.*[a-z])";
const oneUppercase = "(?=.*[A-Z])";
const oneDigit = "(?=.*\\d)";
const oneSpecialSymbol = `(?=.*[${specialSymbols}])`;
const allowedSymbols = `[A-Za-z\\d${specialSymbols}]`;

export const passwordPattern = `^${oneLowercase}${oneUppercase}${oneDigit}${oneSpecialSymbol}${allowedSymbols}{${minLength},${maxLength}}$`;

export const passwordMinLengthRegExp = new RegExp(`^.{${minLength},}$`);
export const passwordMaxLengthRegExp = new RegExp(`^.{0,${maxLength}}$`);
export const passwordOneLowercaseRegExp = new RegExp(oneLowercase);
export const passwordOneUppercaseRegExp = new RegExp(oneUppercase);
export const passwordOneDigitRegExp = new RegExp(oneDigit);
export const passwordOneSpecialSymbolRegExp = new RegExp(oneSpecialSymbol);
export const passwordAllowedSymbolsRegExp = new RegExp(`^${allowedSymbols}*$`);
const passwordPatternRegExp = new RegExp(passwordPattern);

export const SignUpSchema = v.object({
  email: v.pipe(
    v.string(messages.email.valueMissing),
    v.email(messages.email.typeMismatch),
  ),
  password: v.pipe(
    v.string(messages.password.valueMissing),
    v.regex(passwordPatternRegExp, messages.password.patternMismatch),
  ),
});

export const SignInSchema = v.object({
  email: v.string(messages.email.valueMissing),
  password: v.string(messages.password.valueMissing),
});
