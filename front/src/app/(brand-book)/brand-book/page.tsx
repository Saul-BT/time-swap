import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { Building2, MapIcon, MapPin, Users, Wifi } from "lucide-react";
import BrandBookSection from "@/components/brand-book/BrandBookSection";
import ScaleList from "@/components/brand-book/ScaleList";
import SettingsSpecimens from "@/components/brand-book/SettingsSpecimens";
import Specimen from "@/components/brand-book/Specimen";
import SwatchList from "@/components/brand-book/SwatchList";
import TypeScaleList from "@/components/brand-book/TypeScaleList";
import CharacterCount from "@/components/ui/CharacterCount";
import Checkbox from "@/components/ui/Checkbox";
import CompletionMeter from "@/components/ui/CompletionMeter";
import Eyebrow from "@/components/ui/Eyebrow";
import FormField from "@/components/ui/FormField";
import FormNotice from "@/components/ui/FormNotice";
import Icon from "@/components/ui/Icon";
import PasswordField from "@/components/ui/PasswordField";
import Ribbon from "@/components/ui/Ribbon";
import SkillChipList from "@/components/ui/SkillChipList";
import StatusBadge from "@/components/ui/StatusBadge";
import TabularFigure from "@/components/ui/TabularFigure";
import { space, structure } from "@/theme/tokens";

const SAMPLE = "Give an hour, get an hour";

const fullWidth = { width: "100%" } as const;

/** Renders the real components from the real theme, so it cannot drift from them. */
export default function BrandBookPage() {
  return (
    <Container component="main" sx={{ pt: 7, pb: 12 }}>
      <Ribbon variant="page" />
      <Typography variant="h1" sx={{ mt: 4, mb: 7 }}>
        Relevo
      </Typography>

      <BrandBookSection id="palette" title="Palette">
        <SwatchList />
      </BrandBookSection>

      <BrandBookSection id="typography" title="Typography">
        <TypeScaleList sample={SAMPLE} />
      </BrandBookSection>

      <BrandBookSection id="spacing" title="Spacing">
        <ScaleList
          entries={[
            { token: "space.xs", pixels: space.xs * 8 },
            { token: "space.sm", pixels: space.sm * 8 },
            { token: "space.md", pixels: space.md * 8 },
            { token: "space.lg", pixels: space.lg * 8 },
            { token: "space.xl", pixels: space.xl * 8 },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="structure" title="Structure">
        <Specimen
          name="structure"
          variants={[
            {
              label: "borderWidth",
              children: (
                <Typography variant="body2">
                  {structure.borderWidth}px
                </Typography>
              ),
            },
            {
              label: "controlHeight",
              children: (
                <Typography variant="body2">
                  {structure.controlHeight}px
                </Typography>
              ),
            },
            {
              label: "cardRibbonHeight",
              children: (
                <Typography variant="body2">
                  {structure.cardRibbonHeight}px
                </Typography>
              ),
            },
            {
              label: "pageRibbonHeight",
              children: (
                <Typography variant="body2">
                  {structure.pageRibbonHeight}px
                </Typography>
              ),
            },
            {
              label: "contentWidth",
              children: (
                <Typography variant="body2">
                  {structure.contentWidth}px
                </Typography>
              ),
            },
            {
              label: "focusRingWidth",
              children: (
                <Typography variant="body2">
                  {structure.focusRingWidth}px
                </Typography>
              ),
            },
            {
              label: "shape.borderRadius",
              children: <Typography variant="body2">0</Typography>,
            },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="ribbon" title="Ribbon">
        <Specimen
          name="Ribbon"
          variants={[
            {
              label: 'variant="page"',
              children: (
                <div style={fullWidth}>
                  <Ribbon variant="page" />
                </div>
              ),
            },
            {
              label: 'variant="offer"',
              children: (
                <div style={fullWidth}>
                  <Ribbon variant="offer" />
                </div>
              ),
            },
            {
              label: 'variant="request"',
              children: (
                <div style={fullWidth}>
                  <Ribbon variant="request" />
                </div>
              ),
            },
            {
              label: 'variant="stopped"',
              children: (
                <div style={fullWidth}>
                  <Ribbon variant="stopped" />
                </div>
              ),
            },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="buttons" title="Button">
        <Specimen
          name="Button"
          variants={[
            {
              label: 'variant="contained"',
              children: <Button variant="contained">Action</Button>,
            },
            {
              label: 'variant="outlined"',
              children: <Button variant="outlined">Action</Button>,
            },
            {
              label: 'variant="text"',
              children: <Button variant="text">Action</Button>,
            },
            {
              label: "disabled",
              children: (
                <>
                  <Button variant="contained" disabled>
                    Action
                  </Button>
                  <Button variant="outlined" disabled>
                    Action
                  </Button>
                  <Button variant="text" disabled>
                    Action
                  </Button>
                </>
              ),
            },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="fields" title="Fields">
        <Specimen
          name="TextField"
          variants={[
            {
              label: 'variant="outlined"',
              children: <TextField label="Label" defaultValue="" />,
            },
            {
              label: "disabled",
              children: <TextField label="Label" disabled defaultValue="" />,
            },
            {
              label: "error",
              children: <TextField label="Label" error defaultValue="" />,
            },
            {
              label: "multiline",
              children: (
                <TextField
                  label="Label"
                  multiline
                  minRows={2}
                  defaultValue=""
                />
              ),
            },
          ]}
        />
        <Specimen
          name="FormField"
          variants={[
            {
              label: "label",
              children: (
                <FormField htmlFor="bb-field" label="Label">
                  <InputBase id="bb-field" sx={{ px: 2, minHeight: 52 }} />
                </FormField>
              ),
            },
            {
              label: "aside",
              children: (
                <FormField
                  htmlFor="bb-field-aside"
                  label="Label"
                  aside={<Button variant="text">Aside</Button>}
                >
                  <InputBase
                    id="bb-field-aside"
                    sx={{ px: 2, minHeight: 52 }}
                  />
                </FormField>
              ),
            },
            {
              label: "error",
              children: (
                <FormField
                  htmlFor="bb-field-error"
                  label="Label"
                  hint="Hint below the control."
                  error="Explains what to correct."
                >
                  <InputBase
                    id="bb-field-error"
                    sx={{ px: 2, minHeight: 52 }}
                  />
                </FormField>
              ),
            },
          ]}
        />
        <Specimen
          name="PasswordField"
          variants={[
            {
              label: "root",
              children: (
                <PasswordField
                  id="bb-password"
                  name="password"
                  showLabel="Show"
                  hideLabel="Hide"
                />
              ),
            },
          ]}
        />
        <Specimen
          name="Checkbox"
          variants={[
            {
              label: "root",
              children: <Checkbox id="bb-check" name="check" label="Label" />,
            },
            {
              label: "defaultChecked",
              children: (
                <Checkbox
                  id="bb-check-on"
                  name="check-on"
                  label="Label"
                  defaultChecked
                />
              ),
            },
          ]}
        />
        <Specimen
          name="FormNotice"
          variants={[
            {
              label: 'tone="info"',
              children: (
                <FormNotice title="Title">Body of the notice.</FormNotice>
              ),
            },
            {
              label: 'tone="error"',
              children: (
                <FormNotice tone="error" title="Title">
                  Body of the notice.
                </FormNotice>
              ),
            },
          ]}
        />
        <Specimen
          name="InputBase"
          variants={[
            {
              label: "placeholder",
              children: (
                <InputBase
                  placeholder="Placeholder"
                  sx={{ px: 2, minHeight: 52 }}
                />
              ),
            },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="surfaces" title="Surfaces">
        <Specimen
          name="Paper"
          variants={[
            {
              label: 'variant="outlined" (default)',
              children: (
                <Paper sx={{ p: 3, minWidth: 220 }}>
                  <Typography variant="body2">Surface</Typography>
                </Paper>
              ),
            },
          ]}
        />
        <Specimen
          name="Divider"
          variants={[{ label: "root", children: <Divider sx={fullWidth} /> }]}
        />
        <Specimen
          name="Avatar"
          variants={[{ label: "root", children: <Avatar>TS</Avatar> }]}
        />
      </BrandBookSection>

      <BrandBookSection id="chips" title="Chips">
        <Specimen
          name="Chip"
          variants={[
            { label: "root", children: <Chip label="Label" /> },
            {
              label: "active · FilterList",
              children: (
                <Chip
                  label="Label"
                  sx={{ bgcolor: "text.primary", color: "background.default" }}
                />
              ),
            },
            {
              label: "compact · SkillChipList",
              children: <Chip label="Label" sx={{ minHeight: 32 }} />,
            },
          ]}
        />
        <Specimen
          name="SkillChipList"
          variants={[
            {
              label: "items",
              children: <SkillChipList label="Skills" items={["One", "Two"]} />,
            },
            {
              label: "compact",
              children: (
                <SkillChipList compact label="Skills" items={["One", "Two"]} />
              ),
            },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="components" title="Components">
        <Specimen
          name="Eyebrow"
          variants={[
            { label: "root", children: <Eyebrow>Label</Eyebrow> },
            {
              label: 'color="primary.main"',
              children: <Eyebrow color="primary.main">Label</Eyebrow>,
            },
            {
              label: 'color="secondary.main"',
              children: <Eyebrow color="secondary.main">Label</Eyebrow>,
            },
          ]}
        />
        <Specimen
          name="TabularFigure"
          variants={[
            {
              label: 'variant="h2"',
              children: <TabularFigure variant="h2">+6 h</TabularFigure>,
            },
            {
              label: 'variant="h4"',
              children: <TabularFigure variant="h4">−3 h</TabularFigure>,
            },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="controls" title="Controls">
        <Specimen
          name="ToggleButtonGroup"
          variants={[
            {
              label: 'exclusive value="district"',
              children: (
                <ToggleButtonGroup exclusive value="district" aria-label="Zone">
                  <ToggleButton value="city">
                    <Icon icon={Building2} />
                    City
                  </ToggleButton>
                  <ToggleButton value="district">
                    <Icon icon={MapIcon} />
                    District
                  </ToggleButton>
                  <ToggleButton value="neighborhood">
                    <Icon icon={MapPin} />
                    Neighbourhood
                  </ToggleButton>
                </ToggleButtonGroup>
              ),
            },
          ]}
        />
        <Specimen
          name="Switch"
          variants={[
            {
              label: "root",
              children: (
                <Switch slotProps={{ input: { "aria-label": "Off" } }} />
              ),
            },
            {
              label: "defaultChecked",
              children: (
                <Switch
                  defaultChecked
                  slotProps={{ input: { "aria-label": "On" } }}
                />
              ),
            },
            {
              label: "disabled",
              children: (
                <Switch
                  disabled
                  slotProps={{ input: { "aria-label": "Disabled" } }}
                />
              ),
            },
          ]}
        />
        <Specimen
          name="Checkbox"
          variants={[
            {
              label: "icon",
              children: (
                <>
                  <Checkbox
                    id="bb-check-person"
                    name="modality"
                    label="In person"
                    icon={<Icon icon={Users} />}
                    defaultChecked
                  />
                  <Checkbox
                    id="bb-check-remote"
                    name="modality"
                    label="Remote"
                    icon={<Icon icon={Wifi} />}
                  />
                </>
              ),
            },
            {
              label: "hideLabel",
              children: (
                <>
                  <Checkbox
                    id="bb-check-cell"
                    name="cell"
                    label="Tuesday · Afternoon"
                    hideLabel
                  />
                  <Checkbox
                    id="bb-check-cell-on"
                    name="cell"
                    label="Tuesday · Evening"
                    hideLabel
                    defaultChecked
                  />
                  <Checkbox
                    id="bb-check-cell-off"
                    name="cell"
                    label="Fixed"
                    hideLabel
                    defaultChecked
                    disabled
                  />
                </>
              ),
            },
          ]}
        />
        <Specimen
          name="Table"
          variants={[
            {
              label: "root",
              children: (
                <TableContainer sx={fullWidth}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell align="center">Visitor</TableCell>
                        <TableCell align="center">Member</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Bio
                        </TableCell>
                        <TableCell align="center">
                          <Icon icon={Users} size="sm" label="Yes" />
                        </TableCell>
                        <TableCell align="center">
                          <Icon icon={Users} size="sm" label="Yes" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Skills
                        </TableCell>
                        <TableCell align="center" />
                        <TableCell align="center">
                          <Icon icon={Users} size="sm" label="Yes" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ),
            },
          ]}
        />
        <Specimen
          name="Skeleton"
          variants={[
            {
              label: "text · rectangular",
              children: (
                <div style={fullWidth}>
                  <Skeleton variant="text" width="60%" sx={{ fontSize: 40 }} />
                  <Skeleton variant="text" />
                  <Skeleton
                    variant="rectangular"
                    height={structure.controlHeight}
                    sx={{ mt: 2 }}
                  />
                </div>
              ),
            },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="settings-primitives" title="Settings primitives">
        <Specimen
          name="Icon"
          variants={[
            {
              label: 'size="sm" · size="md"',
              children: (
                <>
                  <Icon icon={MapPin} size="sm" />
                  <Icon icon={MapPin} />
                </>
              ),
            },
            {
              label: 'label="Zone"',
              children: <Icon icon={MapPin} label="Zone" />,
            },
          ]}
        />
        <Specimen
          name="StatusBadge"
          variants={[
            {
              label: 'status="done"',
              children: <StatusBadge status="done" label="Done" />,
            },
            {
              label: 'status="review"',
              children: <StatusBadge status="review" label="Review" />,
            },
            {
              label: 'status="missing"',
              children: <StatusBadge status="missing" label="Missing" />,
            },
            {
              label: 'tone="inverse" (over ink)',
              children: (
                <Box
                  sx={{
                    display: "inline-flex",
                    gap: 1,
                    padding: 1,
                    backgroundColor: "text.primary",
                  }}
                >
                  <StatusBadge status="done" label="Done" tone="inverse" />
                  <StatusBadge status="review" label="Review" tone="inverse" />
                  <StatusBadge
                    status="missing"
                    label="Missing"
                    tone="inverse"
                  />
                </Box>
              ),
            },
          ]}
        />
        <Specimen
          name="CharacterCount"
          variants={[
            {
              label: "within limit",
              children: (
                <CharacterCount count={164} max={600}>
                  164 / 600
                </CharacterCount>
              ),
            },
            {
              label: "over limit",
              children: (
                <CharacterCount count={612} max={600}>
                  612 / 600
                </CharacterCount>
              ),
            },
          ]}
        />
        <Specimen
          name="CompletionMeter"
          variants={[
            {
              label: "3 / 5",
              children: (
                <div style={fullWidth}>
                  <CompletionMeter
                    done={3}
                    total={5}
                    sentence="3 of 5 ready. Presentation to review; zone missing."
                  />
                </div>
              ),
            },
            {
              label: "5 / 5",
              children: (
                <div style={fullWidth}>
                  <CompletionMeter
                    done={5}
                    total={5}
                    sentence="5 of 5 ready. Ready to publish."
                  />
                </div>
              ),
            },
          ]}
        />
      </BrandBookSection>

      <BrandBookSection id="settings" title="Settings">
        <SettingsSpecimens />
      </BrandBookSection>
    </Container>
  );
}
