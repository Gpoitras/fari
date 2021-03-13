import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import FlipToBackIcon from "@material-ui/icons/FlipToBack";
import HelpIcon from "@material-ui/icons/Help";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import React from "react";
import { ContentEditable } from "../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../components/FateLabel/FateLabel";
import { IPage, Position } from "../../../../../domains/character/types";
import { useTextColors } from "../../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { smallIconButtonStyle } from "../CharacterV3Dialog";

export const SheetHeader: React.FC<{
  label: string;
  currentPageIndex: number;
  position: Position;
  helpLink: string | undefined;
  pages: Array<IPage> | undefined;
  editing: boolean;
  onLabelChange?: (newLabel: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onReposition: (position: Position) => void;
  onMoveToPage: (pageIndex: number) => void;
  visibleOnCard?: boolean;
  onToggleVisibleOnCard?: () => void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const headerColor = theme.palette.background.paper;
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);
  const sheetHeader = css({
    background: headerBackgroundColors.primary,
    color: headerColor,
    width: "100%",
    padding: ".5rem",
  });

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className={sheetHeader}>
      <Grid container justify="space-between" wrap="nowrap" spacing={1}>
        {props.helpLink && (
          <Grid item>
            <IconButton
              size="small"
              className={smallIconButtonStyle}
              onClick={() => {
                window.open(props.helpLink);
              }}
            >
              <HelpIcon htmlColor={headerColor} />
            </IconButton>
          </Grid>
        )}
        <Grid item xs>
          <FateLabel
            className={css({
              fontSize: "1.2rem",
            })}
          >
            <ContentEditable
              data-cy={`character-dialog.${props.label}.label`}
              readonly={!props.editing || !props.onLabelChange}
              border={props.editing && !!props.onLabelChange}
              borderColor={headerColor}
              value={props.label}
              onChange={(newLabel) => {
                props.onLabelChange?.(newLabel);
              }}
            />
          </FateLabel>
        </Grid>
        {props.editing && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.visible-on-card")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.visible-on-card`}
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  props.onToggleVisibleOnCard?.();
                }}
              >
                {props.visibleOnCard ? (
                  <StarIcon htmlColor={headerColor} />
                ) : (
                  <StarBorderIcon htmlColor={headerColor} />
                )}
              </IconButton>
            </Tooltip>
          </Grid>
        )}

        {props.editing && (
          <Grid item>
            {/* TODO: text */}
            <Tooltip title={"Move"}>
              <IconButton
                data-cy={`character-dialog.${props.label}.move`}
                size="small"
                className={smallIconButtonStyle}
                onClick={handleClick}
              >
                <FlipToBackIcon htmlColor={headerColor} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {props.editing && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.remove-section")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.remove`}
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  props.onRemove?.();
                }}
              >
                <RemoveCircleOutlineIcon htmlColor={headerColor} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            props.onMoveUp();
          }}
        >
          <ListItemIcon>
            <ArrowUpwardIcon />
          </ListItemIcon>
          {/* TODO: text */}
          {"Move Up"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.onMoveDown();
          }}
        >
          {" "}
          <ListItemIcon>
            <ArrowDownwardIcon />
          </ListItemIcon>
          {/* TODO: text */}
          {"Move Down"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            const newPosition =
              props.position === Position.Left ? Position.Right : Position.Left;
            props.onReposition(newPosition);
          }}
        >
          <ListItemIcon>
            <ArrowForwardIcon
              className={css({
                transform:
                  props.position === Position.Left
                    ? undefined
                    : "rotate(180deg)",
              })}
            />
          </ListItemIcon>
          {props.position === Position.Left ? "Move Right" : "Move Left"}
        </MenuItem>
        {props.pages?.map((page, pageIndex) => {
          if (pageIndex === props.currentPageIndex) {
            return null;
          }
          return (
            <MenuItem
              key={page.id}
              onClick={() => {
                handleClose();
                props.onMoveToPage(pageIndex);
              }}
            >
              <ListItemIcon>
                <FlipToBackIcon />
              </ListItemIcon>
              {`Move To Page: ${page.label}`}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
SheetHeader.displayName = "SheetHeader";