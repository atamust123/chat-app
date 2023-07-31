"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { AuthButton } from "./AuthButton";
import Form from "./Form/Form";

enum Variant {
  "LOGIN",
  "REGISTER",
}

export const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>(Variant.LOGIN);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    session?.status === "authenticated" && router.push("/users");
  }, [session.status, router]);

  const toggleVariant = useCallback(() => {
    setVariant((prev) =>
      prev === Variant.LOGIN ? Variant.REGISTER : Variant.LOGIN
    );
  }, []);

  const formAttributes = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);

    if (variant === Variant.LOGIN) {
      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          callback?.error && toast.error("Invalid Credentials");
          callback?.ok && router.push("/users");
        })
        .finally(() => setLoading(false));
    } else if (variant === Variant.REGISTER) {
      axios
        .post("/api/register", data)
        .then(() =>
          signIn("credentials", {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          callback?.error && toast.error("Invalid Credentials");
          callback?.ok && router.push("/users");
        })
        .catch((error) => toast.error(error + "Something went wrong!"))
        .finally(() => setLoading(false));
    }
  };

  const socialAction = (action: "github" | "google") => {
    setLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        callback?.error && toast.error("Invalid Credentials");
        callback?.ok && router.push("/users");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <Form
          formAttributes={formAttributes}
          formProps={{ className: "space-y-6" }}
          onSubmit={formAttributes.handleSubmit(onSubmit)}
        >
          {variant === Variant.REGISTER && (
            <Form.Input
              label="Name"
              loading={loading}
              name="name"
              key={"name"}
            />
          )}
          <Form.Input
            label="Email Address"
            loading={loading}
            name="email"
            key={"email"}
            inputProps={{ required: true, type: "email" }}
          />
          <Form.Input
            label="Password"
            loading={loading}
            name="password"
            key={"password"}
            inputProps={{ required: true, type: "password" }}
          />
          <Form.Button disabled={loading} fullWidth>
            {variant === Variant.LOGIN ? "Sign in" : "Register"}
          </Form.Button>
        </Form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {variant === Variant.LOGIN
              ? "New to Chat?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === Variant.LOGIN ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};
