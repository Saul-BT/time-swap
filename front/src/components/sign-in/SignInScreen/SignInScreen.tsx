import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { FOOTER_LINKS } from "@/data/navigation";
import type { SignInErrorId } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import Ribbon from "../../ui/Ribbon";
import SignInForm, { type SignInFormProps } from "../SignInForm";
import SignInPanel from "../SignInPanel";
import {
  SignInScreenBrand,
  SignInScreenBrandName,
  SignInScreenColumn,
  SignInScreenMain,
  SignInScreenRoot,
  SignInScreenSplit,
} from "./SignInScreen.style";
import { signInScreenClasses } from "./SignInScreen.util";

export type SignInScreenProps = {
  action: SignInFormProps["action"];
  error?: SignInErrorId;
};

export default async function SignInScreen({
  action,
  error,
}: SignInScreenProps) {
  const { brand, signIn } = await getDictionary();
  const locale = await getLocale();
  // TODO(content): resolves to "#" until the code of conduct page exists.
  const conductHref =
    FOOTER_LINKS.find((link) => link.id === "codeOfConduct")?.href ?? "#";

  return (
    <SignInScreenRoot className={signInScreenClasses.root}>
      <Ribbon variant="page" />
      <SignInScreenSplit className={signInScreenClasses.split}>
        <SignInScreenColumn className={signInScreenClasses.column}>
          <SignInScreenBrand
            className={signInScreenClasses.brand}
            href={localizePath(locale, "home")}
          >
            <SignInScreenBrandName
              className={signInScreenClasses.brandName}
              variant="h3"
              component="span"
            >
              {brand.name}
            </SignInScreenBrandName>
          </SignInScreenBrand>

          <SignInScreenMain className={signInScreenClasses.main}>
            <SignInForm action={action} error={error} />
          </SignInScreenMain>

          <Typography
            className={signInScreenClasses.note}
            variant="caption"
            component="p"
            color="textSecondary"
          >
            {signIn.conduct.before}
            <Link href={conductHref} variant="caption">
              {signIn.conduct.link}
            </Link>
            {signIn.conduct.after}
          </Typography>
        </SignInScreenColumn>

        <SignInPanel />
      </SignInScreenSplit>
    </SignInScreenRoot>
  );
}
