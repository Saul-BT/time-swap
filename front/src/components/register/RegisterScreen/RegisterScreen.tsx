import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { CATEGORY_IDS } from "@/data/categories";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import Ribbon from "../../ui/Ribbon";
import RegisterWizard from "../RegisterWizard";
import {
  RegisterScreenBrand,
  RegisterScreenBrandName,
  RegisterScreenHeader,
  RegisterScreenMain,
  RegisterScreenRoot,
} from "./RegisterScreen.style";
import { registerScreenClasses } from "./RegisterScreen.util";

export default async function RegisterScreen() {
  const { brand, categories, register } = await getDictionary();
  const locale = await getLocale();

  const tagOptions = CATEGORY_IDS.map((id) => ({
    id,
    label: categories.items[id],
  }));

  return (
    <RegisterScreenRoot className={registerScreenClasses.root}>
      <Ribbon variant="page" />
      <RegisterScreenHeader className={registerScreenClasses.header}>
        <RegisterScreenBrand
          className={registerScreenClasses.brand}
          href={localizePath(locale, "home")}
        >
          <RegisterScreenBrandName
            className={registerScreenClasses.brandName}
            variant="h3"
            component="span"
          >
            {brand.name}
          </RegisterScreenBrandName>
        </RegisterScreenBrand>

        <Typography variant="body2">
          {register.header.hasAccount}{" "}
          <Link href={localizePath(locale, "signIn")}>
            {register.header.signIn}
          </Link>
        </Typography>
      </RegisterScreenHeader>

      <RegisterScreenMain className={registerScreenClasses.main}>
        <RegisterWizard
          copy={register}
          tagOptions={tagOptions}
          signInHref={localizePath(locale, "signIn")}
        />
      </RegisterScreenMain>
    </RegisterScreenRoot>
  );
}
