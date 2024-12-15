// src/ui/password.tsx
import {Layout} from "./base.js";
import"./form.js";
import {FormAlert} from "./form.js";
function PasswordUI(input) {
  const copy = {
    ...DEFAULT_COPY,
    ...input.copy
  };
  return {
    sendCode: input.sendCode,
    login: async (_req, form3, error) => {
      const jsx = jsxDEV(Layout, {
        children: jsxDEV("form", {
          "data-component": "form",
          method: "post",
          children: [
            jsxDEV(FormAlert, {
              message: error?.type && copy?.[`error_${error.type}`]
            }, undefined, false, undefined, this),
            jsxDEV("input", {
              "data-component": "input",
              type: "email",
              name: "email",
              required: true,
              placeholder: copy.input_email,
              autofocus: !error,
              value: form3?.get("email")?.toString()
            }, undefined, false, undefined, this),
            jsxDEV("input", {
              "data-component": "input",
              autofocus: error?.type === "invalid_password",
              required: true,
              type: "password",
              name: "password",
              placeholder: copy.input_password,
              autoComplete: "current-password"
            }, undefined, false, undefined, this),
            jsxDEV("button", {
              "data-component": "button",
              children: copy.button_continue
            }, undefined, false, undefined, this),
            jsxDEV("div", {
              "data-component": "form-footer",
              children: [
                jsxDEV("span", {
                  children: [
                    copy.register_prompt,
                    " ",
                    jsxDEV("a", {
                      "data-component": "link",
                      href: "register",
                      children: copy.register
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV("a", {
                  "data-component": "link",
                  href: "change",
                  children: copy.change_prompt
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this);
      return new Response(jsx.toString(), {
        status: error ? 401 : 200,
        headers: {
          "Content-Type": "text/html"
        }
      });
    },
    register: async (_req, state, form3, error) => {
      const emailError = ["invalid_email", "email_taken"].includes(error?.type || "");
      const passwordError = ["invalid_password", "password_mismatch"].includes(error?.type || "");
      const jsx = jsxDEV(Layout, {
        children: jsxDEV("form", {
          "data-component": "form",
          method: "post",
          children: [
            jsxDEV(FormAlert, {
              message: error?.type && copy?.[`error_${error.type}`]
            }, undefined, false, undefined, this),
            state.type === "start" && jsxDEV(Fragment, {
              children: [
                jsxDEV("input", {
                  type: "hidden",
                  name: "action",
                  value: "register"
                }, undefined, false, undefined, this),
                jsxDEV("input", {
                  "data-component": "input",
                  autofocus: !error || emailError,
                  type: "email",
                  name: "email",
                  value: !emailError ? form3?.get("email")?.toString() : "",
                  required: true,
                  placeholder: copy.input_email
                }, undefined, false, undefined, this),
                jsxDEV("input", {
                  "data-component": "input",
                  autofocus: passwordError,
                  type: "password",
                  name: "password",
                  placeholder: copy.input_password,
                  required: true,
                  value: !passwordError ? form3?.get("password")?.toString() : "",
                  autoComplete: "new-password"
                }, undefined, false, undefined, this),
                jsxDEV("input", {
                  "data-component": "input",
                  type: "password",
                  name: "repeat",
                  required: true,
                  autofocus: passwordError,
                  placeholder: copy.input_repeat,
                  autoComplete: "new-password"
                }, undefined, false, undefined, this),
                jsxDEV("button", {
                  "data-component": "button",
                  children: copy.button_continue
                }, undefined, false, undefined, this),
                jsxDEV("div", {
                  "data-component": "form-footer",
                  children: jsxDEV("span", {
                    children: [
                      copy.login_prompt,
                      " ",
                      jsxDEV("a", {
                        "data-component": "link",
                        href: "authorize",
                        children: copy.login
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            state.type === "code" && jsxDEV(Fragment, {
              children: [
                jsxDEV("input", {
                  type: "hidden",
                  name: "action",
                  value: "verify"
                }, undefined, false, undefined, this),
                jsxDEV("input", {
                  "data-component": "input",
                  autofocus: true,
                  name: "code",
                  minLength: 6,
                  maxLength: 6,
                  required: true,
                  placeholder: copy.input_code,
                  autoComplete: "one-time-code"
                }, undefined, false, undefined, this),
                jsxDEV("button", {
                  "data-component": "button",
                  children: copy.button_continue
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this);
      return new Response(jsx.toString(), {
        headers: {
          "Content-Type": "text/html"
        }
      });
    },
    change: async (_req, state, form3, error) => {
      const passwordError = ["invalid_password", "password_mismatch"].includes(error?.type || "");
      const jsx = jsxDEV(Layout, {
        children: [
          jsxDEV("form", {
            "data-component": "form",
            method: "post",
            replace: true,
            children: [
              jsxDEV(FormAlert, {
                message: error?.type && copy?.[`error_${error.type}`]
              }, undefined, false, undefined, this),
              state.type === "start" && jsxDEV(Fragment, {
                children: [
                  jsxDEV("input", {
                    type: "hidden",
                    name: "action",
                    value: "code"
                  }, undefined, false, undefined, this),
                  jsxDEV("input", {
                    "data-component": "input",
                    autofocus: true,
                    type: "email",
                    name: "email",
                    required: true,
                    value: form3?.get("email")?.toString(),
                    placeholder: copy.input_email
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              state.type === "code" && jsxDEV(Fragment, {
                children: [
                  jsxDEV("input", {
                    type: "hidden",
                    name: "action",
                    value: "verify"
                  }, undefined, false, undefined, this),
                  jsxDEV("input", {
                    "data-component": "input",
                    autofocus: true,
                    name: "code",
                    minLength: 6,
                    maxLength: 6,
                    required: true,
                    placeholder: copy.input_code,
                    autoComplete: "one-time-code"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              state.type === "update" && jsxDEV(Fragment, {
                children: [
                  jsxDEV("input", {
                    type: "hidden",
                    name: "action",
                    value: "update"
                  }, undefined, false, undefined, this),
                  jsxDEV("input", {
                    "data-component": "input",
                    autofocus: true,
                    type: "password",
                    name: "password",
                    placeholder: copy.input_password,
                    required: true,
                    value: !passwordError ? form3?.get("password")?.toString() : "",
                    autoComplete: "new-password"
                  }, undefined, false, undefined, this),
                  jsxDEV("input", {
                    "data-component": "input",
                    type: "password",
                    name: "repeat",
                    required: true,
                    value: !passwordError ? form3?.get("password")?.toString() : "",
                    placeholder: copy.input_repeat,
                    autoComplete: "new-password"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV("button", {
                "data-component": "button",
                children: copy.button_continue
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          state.type === "code" && jsxDEV("form", {
            method: "post",
            children: [
              jsxDEV("input", {
                type: "hidden",
                name: "action",
                value: "code"
              }, undefined, false, undefined, this),
              jsxDEV("input", {
                type: "hidden",
                name: "email",
                value: state.email
              }, undefined, false, undefined, this),
              state.type === "code" && jsxDEV("div", {
                "data-component": "form-footer",
                children: [
                  jsxDEV("span", {
                    children: [
                      copy.code_return,
                      " ",
                      jsxDEV("a", {
                        "data-component": "link",
                        href: "authorize",
                        children: copy.login.toLowerCase()
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  jsxDEV("button", {
                    "data-component": "link",
                    children: copy.code_resend
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this);
      return new Response(jsx.toString(), {
        status: error ? 400 : 200,
        headers: {
          "Content-Type": "text/html"
        }
      });
    }
  };
}
import {
jsxDEV,
Fragment
} from "hono/jsx/jsx-dev-runtime";
var DEFAULT_COPY = {
  error_email_taken: "There is already an account with this email.",
  error_invalid_code: "Code is incorrect.",
  error_invalid_email: "Email is not valid.",
  error_invalid_password: "Password is incorrect.",
  error_password_mismatch: "Passwords do not match.",
  register_title: "Welcome to the app",
  register_description: "Sign in with your email",
  login_title: "Welcome to the app",
  login_description: "Sign in with your email",
  register: "Register",
  register_prompt: "Don't have an account?",
  login_prompt: "Already have an account?",
  login: "Login",
  change_prompt: "Forgot password?",
  code_resend: "Resend code",
  code_return: "Back to",
  logo: "A",
  input_email: "Email",
  input_password: "Password",
  input_code: "Code",
  input_repeat: "Repeat password",
  button_continue: "Continue"
};
export {
  PasswordUI
};
