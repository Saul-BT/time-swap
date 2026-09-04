import Typography from "@mui/material/Typography";
import { getDictionary } from "@/i18n/dictionary";
import Section from "../../layout/Section";
import Ribbon from "../../ui/Ribbon";
import {
  DisputeNoticeBody,
  DisputeNoticeLabel,
  DisputeNoticePanel,
  DisputeNoticeText,
} from "./DisputeNotice.style";
import { disputeNoticeClasses } from "./DisputeNotice.util";

/** Takes the brake colour: it describes something that stops. */
export default async function DisputeNotice() {
  const { dispute } = await getDictionary();

  return (
    // The framed members band above closes its own gap, so the top edge is flushed.
    <Section flushTop>
      <DisputeNoticePanel className={disputeNoticeClasses.panel}>
        <Ribbon variant="stopped" />
        <DisputeNoticeBody className={disputeNoticeClasses.body}>
          <DisputeNoticeLabel className={disputeNoticeClasses.label}>
            {dispute.label}
          </DisputeNoticeLabel>
          <DisputeNoticeText className={disputeNoticeClasses.text}>
            <Typography variant="h4" component="p" gutterBottom>
              {dispute.title}
            </Typography>
            <Typography variant="body2">{dispute.body}</Typography>
          </DisputeNoticeText>
        </DisputeNoticeBody>
      </DisputeNoticePanel>
    </Section>
  );
}
