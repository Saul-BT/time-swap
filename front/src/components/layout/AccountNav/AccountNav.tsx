import { ACCOUNT_NAV } from "@/data/settings";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { AccountNavList, AccountNavRoot } from "./AccountNav.style";
import { accountNavClasses } from "./AccountNav.util";
import AccountNavItem from "./AccountNavItem";

export default async function AccountNav() {
  const { settings } = await getDictionary();
  const locale = await getLocale();

  return (
    <AccountNavRoot
      className={accountNavClasses.root}
      aria-label={settings.account.label}
    >
      <AccountNavList className={accountNavClasses.list}>
        {ACCOUNT_NAV.map((link) => (
          <li key={link.id} className={accountNavClasses.item}>
            <AccountNavItem
              id={link.id}
              href={localizePath(locale, link.target)}
              name={settings.account[link.id]}
            />
          </li>
        ))}
      </AccountNavList>
    </AccountNavRoot>
  );
}
