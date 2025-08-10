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
} from "./chunk-I6CABP7R.js";
import "./chunk-WDXQH3A3.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-5CQLICGK.js";
import "./chunk-GIXGFGK6.js";
import "./chunk-2VI5MQF7.js";
import "./chunk-YSSXMBKN.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-EIUYHA3B.js";
import "./chunk-75JCTVE3.js";
import "./chunk-3HSWHSSE.js";
import "./chunk-JQVMWCR2.js";
import "./chunk-MO7F4LWK.js";
import "./chunk-NVFITO44.js";
import "./chunk-ISFXMMNI.js";
import "./chunk-KSR2SZIL.js";
import "./chunk-YDOKMMVJ.js";
import "./chunk-QVYD3SQ5.js";
import "./chunk-DQ7OVFPD.js";
import "./chunk-QCETVJKM.js";
import "./chunk-EOFW2REK.js";
import "./chunk-X67SN35C.js";
import "./chunk-RSENVDYD.js";
import "./chunk-CODNF7DL.js";
import "./chunk-GUKU2ROB.js";
import "./chunk-HHIHJHP4.js";
import "./chunk-NDZIWK7R.js";
import "./chunk-NNJGR2TI.js";
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
