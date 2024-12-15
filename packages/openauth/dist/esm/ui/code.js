// src/ui/code.tsx
import {UnknownStateError} from "../error.js";
import {Layout} from "./base.js";
import {FormAlert} from "./form.js";
function CodeUI(props) {
  return {
    sendCode: props.sendCode,
    length: 6,
    request: async (_req, state, _form, error2) => {
      if (state.type === "start") {
        const jsx = jsxDEV(Layout, {
          children: [
            jsxDEV("form", {
              "data-component": "form",
              method: "post",
              children: [
                error2?.type === "invalid_claim" && jsxDEV(FormAlert, {
                  message: "Email address is not valid"
                }, undefined, false, undefined, this),
                jsxDEV("input", {
                  type: "hidden",
                  name: "action",
                  value: "request"
                }, undefined, false, undefined, this),
                jsxDEV("input", {
                  "data-component": "input",
                  autofocus: true,
                  type: "email",
                  name: "email",
                  required: true,
                  placeholder: "Email"
                }, undefined, false, undefined, this),
                jsxDEV("button", {
                  "data-component": "button",
                  children: "Continue"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            jsxDEV("p", {
              "data-component": "form-footer",
              children: "We'll send a pin code to your email"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this);
        return new Response(jsx.toString(), {
          headers: {
            "Content-Type": "text/html"
          }
        });
      }
      if (state.type === "code") {
        const jsx = jsxDEV(Layout, {
          children: [
            jsxDEV("form", {
              "data-component": "form",
              class: "form",
              method: "post",
              children: [
                error2?.type === "invalid_code" && jsxDEV(FormAlert, {
                  message: "Invalid code"
                }, undefined, false, undefined, this),
                state.type === "code" && jsxDEV(FormAlert, {
                  message: (state.resend ? "Code resent to " : "Code sent to ") + state.claims.email,
                  color: "success"
                }, undefined, false, undefined, this),
                jsxDEV("input", {
                  type: "hidden",
                  name: "action",
                  value: "verify"
                }, undefined, false, undefined, this),
                jsxDEV("input", {
                  "data-component": "input",
                  autofocus: true,
                  minLength: 6,
                  maxLength: 6,
                  type: "text",
                  name: "code",
                  required: true,
                  placeholder: "Code"
                }, undefined, false, undefined, this),
                jsxDEV("button", {
                  "data-component": "button",
                  children: "Continue"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            jsxDEV("form", {
              method: "post",
              children: [
                Object.entries(state.claims).map(([key, value]) => jsxDEV("input", {
                  type: "hidden",
                  name: key,
                  value,
                  className: "hidden"
                }, key, false, undefined, this)),
                jsxDEV("input", {
                  type: "hidden",
                  name: "action",
                  value: "request"
                }, undefined, false, undefined, this),
                jsxDEV("div", {
                  "data-component": "form-footer",
                  children: jsxDEV("span", {
                    children: [
                      "Didn't get code? ",
                      jsxDEV("button", {
                        "data-component": "link",
                        children: "Resend"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this);
        return new Response(jsx.toString(), {
          headers: {
            "Content-Type": "text/html"
          }
        });
      }
      throw new UnknownStateError;
    }
  };
}
import {
jsxDEV
} from "hono/jsx/jsx-dev-runtime";
export {
  CodeUI
};
