import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import Ribbon from "../../ui/Ribbon";
import RegisterWizard, { type RegisterWizardProps } from "../RegisterWizard";
import {
  RegisterScreenBrand,
  RegisterScreenBrandName,
  RegisterScreenHeader,
  RegisterScreenMain,
  RegisterScreenRoot,
} from "./RegisterScreen.style";
import { registerScreenClasses } from "./RegisterScreen.util";
import { getCategories } from "@/data/categories";
import { CategoryOption } from "../RegisterWizard/RegisterWizard.util";

export type RegisterScreenProps = {
  action: RegisterWizardProps["action"];
};

export default async function RegisterScreen({ action }: RegisterScreenProps) {
  const { brand, register } = await getDictionary();
  const locale = await getLocale();

  const categories = await getCategories();

  const tagOptions: CategoryOption[] = categories.map((category) => ({
    id: category.id,
    label: category.name,
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
          homeHref={localizePath(locale, "loggedHome")}
          action={action}
        />
      </RegisterScreenMain>
    </RegisterScreenRoot>
  );
}
