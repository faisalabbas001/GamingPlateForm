import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import CircleLoader from "../../Loaders/CircleLoader";

interface Prize {
  _id: string;
  name: string;
  value: number;
  probability: number;
  freeProbability: number;
}

interface PrizeModalProps {
  t: (key: string) => string;
  selectedPrize: Prize | null;
  onFetch: () => void;
  onClose: () => void;
  userId: string;
  settingId: string;
}

const PrizeModal: React.FC<PrizeModalProps> = ({
  t,
  selectedPrize,
  onFetch,
  onClose,
  userId,
  settingId,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      name: selectedPrize?.name || "",
      value: selectedPrize?.value || 0,
      probability: selectedPrize?.probability || 0,
      freeProbability: selectedPrize?.freeProbability || 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Prize name is required")),
      value: Yup.number()
        .required(t("Prize value is required"))
        .min(0, t("Value must be greater than or equal to 0")),
      probability: Yup.number()
        .required(t("Probability is required"))
        .min(0, t("Probability must be greater than or equal to 0"))
        .max(100, t("Probability cannot exceed 100")),
      freeProbability: Yup.number()
        .required(t("Free Probability is required"))
        .min(0, t("Free Probability must be greater than or equal to 0"))
        .max(100, t("Free Probability cannot exceed 100")),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (selectedPrize) {
          const response = await axios.patch(
            `/api/setting?userId=${userId}&settingId=${settingId}&prizeId=${selectedPrize._id}`,
            values
          );
          if (response.status === 200) {
            toast.success(t("Prize updated successfully"), {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
              style: {
                background: "#1E1939",
                color: "white"
              }
            });
            onFetch();
            onClose();
          }
        } else {
          toast.error(t("Prize ID is missing"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            style: {
              background: "#1E1939",
              color: "white"
            }
          });
        }
      } catch (error) {
        console.error("error", error);
        toast.error(t("Error updating prize"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          style: {
            background: "#1E1939",
            color: "white"
          }
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (selectedPrize) {
      formik.setValues({
        name: selectedPrize.name,
        value: selectedPrize.value,
        probability: selectedPrize.probability,
        freeProbability: selectedPrize.freeProbability,
      });
    }
  }, [selectedPrize]);

  return (
    <Dialog open={!!selectedPrize} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 bg-opacity-90 text-white border border-purple-500 rounded-xl backdrop-blur-md max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-purple-400">
            {t("Edit Award")}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">{t("Name")}</Label>
            <Input
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-xs">{formik.errors.name}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">
              {t("Worth")} ({t("Credits")})
            </Label>
            <Input
              id="value"
              type="number"
              value={formik.values.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
            />
            {formik.touched.value && formik.errors.value && (
              <div className="text-red-500 text-xs">{formik.errors.value}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="probability">{t("Probability")} (%)</Label>
            <Input
              id="probability"
              type="number"
              value={formik.values.probability}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
            />
            {formik.touched.probability && formik.errors.probability && (
              <div className="text-red-500 text-xs">
                {formik.errors.probability}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="freeProbability">{t("Free Probability")} (%)</Label>
            <Input
              id="freeProbability"
              type="number"
              value={formik.values.freeProbability}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
            />
            {formik.touched.freeProbability && formik.errors.freeProbability && (
              <div className="text-red-500 text-xs">
                {formik.errors.freeProbability}
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? <CircleLoader /> : t("Save Changes")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrizeModal;
