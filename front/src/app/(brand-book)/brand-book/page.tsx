import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import BrandBookSection from "@/components/brand-book/BrandBookSection";
import ScaleList from "@/components/brand-book/ScaleList";
import Specimen from "@/components/brand-book/Specimen";
import SwatchList from "@/components/brand-book/SwatchList";
import TypeScaleList from "@/components/brand-book/TypeScaleList";
import Eyebrow from "@/components/ui/Eyebrow";
import Ribbon from "@/components/ui/Ribbon";
import SkillChipList from "@/components/ui/SkillChipList";
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
    </Container>
  );
}
