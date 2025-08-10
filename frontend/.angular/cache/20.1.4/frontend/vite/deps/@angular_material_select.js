import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-DJF2EXQB.js";
import "./chunk-IMCGI7MT.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-WIRRNFOE.js";
import "./chunk-BP64JT6G.js";
import "./chunk-R3NFU6YL.js";
import "./chunk-3GLLSHE3.js";
import "./chunk-7QCMCTVN.js";
import "./chunk-ICJTYDO7.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-FJ7SDLXC.js";
import "./chunk-APAR5FT4.js";
import "./chunk-QZ6UMMJE.js";
import "./chunk-R5HOCQCQ.js";
import "./chunk-FAMO3MLG.js";
import "./chunk-H6QT3QXU.js";
import "./chunk-6API2I6L.js";
import "./chunk-DQ7OVFPD.js";
import "./chunk-EE4Q5X5E.js";
import "./chunk-EOFW2REK.js";
import "./chunk-A6I56GCK.js";
import "./chunk-HJUYQKSD.js";
import "./chunk-LF7AEWT5.js";
import "./chunk-HK427YNR.js";
import "./chunk-FWH5NEPM.js";
import "./chunk-NDZIWK7R.js";
import "./chunk-BONVB36I.js";
import "./chunk-TXDUYLVM.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [
      {
        type: 0,
        name: "void",
        styles: {
          type: 6,
          styles: { opacity: 0, transform: "scale(1, 0.8)" },
          offset: null
        }
      },
      {
        type: 1,
        expr: "void => showing",
        animation: {
          type: 4,
          styles: {
            type: 6,
            styles: { opacity: 1, transform: "scale(1, 1)" },
            offset: null
          },
          timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
        },
        options: null
      },
      {
        type: 1,
        expr: "* => void",
        animation: {
          type: 4,
          styles: { type: 6, styles: { opacity: 0 }, offset: null },
          timings: "100ms linear"
        },
        options: null
      }
    ],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
