import { zodResolver } from "@hookform/resolvers/zod";
import { ModalFormContainer } from "../ModalComponents/ModalContainer";
import { reqChangePasswordSchema, type ReqChangePassword } from "@shared/core";
import { useForm } from "react-hook-form";
import { AuthInput } from "../Auth/AuthInput";
import { Lock } from "lucide-react";
import { useState } from "react";
import { ShowPassword } from "../Password utiles/ShowPassword";
import { authApi } from "../../api/authApi";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface ChangePasswordModalProps {
  setModalOpen: (showModal: boolean) => void;
}

export const ChangePasswordModal = ({ setModalOpen }: ChangePasswordModalProps) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ReqChangePassword>({
    resolver: zodResolver(reqChangePasswordSchema),
  });

  const onFormSubmit = async (data: ReqChangePassword) => {
    try {
      const response = await authApi.changePassword(data);

      if (response.status === "success") {
        toast.success(response.message);
        closeModal();
      }
    } catch (err: any) {
      const data = (err as AxiosError)?.response?.data || err;
      if (data?.errors) {
        data.errors.forEach((e: any) => {
          console.log(e.field, { message: e.message });

          setError(e.field, { message: `${e.message}` });
        });
        return;
      }
      if (data?.message) {
        toast.error(data.message);
        return;
      }
      toast.error("An unexpected error occurred");
      console.error("Login error:", data);
    }
  };

  const closeModal = () => {
    reset();
    setModalOpen(false);
  };

  return (
    <ModalFormContainer
      title="Change password"
      closeModal={closeModal}
      disabled={isSubmitting}
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <AuthInput
        label="Password"
        type={showOldPassword ? "text" : "password"}
        placeholder="Enter your current password"
        icon={Lock}
        {...register("old_password")}
        error={errors.old_password?.message}
        disabled={isSubmitting}
      >
        <ShowPassword
          showPassword={showOldPassword}
          toggleShowPassword={() => setShowOldPassword(!showOldPassword)}
          disabled={isSubmitting}
        />
      </AuthInput>
      <AuthInput
        label="Password"
        type={showNewPassword ? "text" : "password"}
        placeholder="Create a new password"
        icon={Lock}
        {...register("new_password")}
        error={errors.new_password?.message}
        disabled={isSubmitting}
      >
        <ShowPassword
          showPassword={showNewPassword}
          toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
          disabled={isSubmitting}
        />
      </AuthInput>
      <AuthInput
        label="Password"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm your new password"
        icon={Lock}
        {...register("confirm_new_password")}
        error={errors.confirm_new_password?.message}
        disabled={isSubmitting}
      >
        <ShowPassword
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={isSubmitting}
        />
      </AuthInput>
    </ModalFormContainer>
  );
};
