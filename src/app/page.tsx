"use client";
import { useState, ChangeEvent } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  gender: string;
  image?: File | null;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    rollNumber: "",
    gender: "",
    image: null,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [qrVisible, setQrIsVisible] = useState<boolean>(false);
  const [qr, setQr] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";

    const rollNumber = Number(formData.rollNumber); // Convert to number for validation
    if (formData.rollNumber === "" || rollNumber > 24126060 || rollNumber < 24126001) {
        newErrors.rollNumber = "Roll number must be between 24126001 and 24126060";
    }

    if (!formData.gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleQrCodeGenerator = (): void => {
    if (validateForm()) {
      QRCode.toDataURL(`https://preview-ebon.vercel.app/ticket/${formData.firstName}/${formData.email}/${formData.rollNumber}`).then((url) => {
        setQr(url);
        setQrIsVisible(true);
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    if (name === "image" && e.target instanceof HTMLInputElement && e.target.files) {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
    } else {
        setFormData((prev) => ({
            ...prev,
            [name]: value, // Directly use value as it's now a string
        }));
    }
};



  const downloadQrCode = () => {
    if (qr) {
      const link = document.createElement("a");
      link.href = qr;
      link.download = "qr_code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center p-4">Ticketer</h1>
      <p className="text-gray-400 text-sm text-center">Enter details to generate your ticket</p>

      <form className="flex w-96 flex-col gap-4 items-center justify-center m-2 p-2">
        <input
          type="text"
          name="firstName"
          placeholder="First Name.."
          className="bg-transparent border-gray-700 rounded-lg border p-2 w-96"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name.."
          className="bg-transparent border-gray-700 rounded-lg border p-2 w-96"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email.."
          className="bg-transparent border-gray-700 rounded-lg border p-2 w-96"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <input
          type="number"
          name="rollNumber"
          placeholder="Roll Number.."
          className="bg-transparent border-gray-700 rounded-lg border p-2 w-96"
          value={formData.rollNumber || ""}
          onChange={handleInputChange}
        />
        {errors.rollNumber && <p className="text-red-500">{errors.rollNumber}</p>}

        <select
          name="gender"
          className="bg-gray-700 rounded-sm p-2 w-96"
          value={formData.gender}
          onChange={handleInputChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500">{errors.gender}</p>}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          className="w-96 p-2 bg-white rounded-lg"
        />

        <button
          type="button"
          className="w-96 p-2 bg-white rounded-lg text-black"
          onClick={handleQrCodeGenerator}
        >
          Generate QR Code
        </button>
      </form>

      {qrVisible && (
        <div className="mt-8">
          <Image
            src={qr}
            alt="QR Code"
            width={400}
            height={300}
            className="border border-gray-700 p-4"
          />
          <button
            onClick={downloadQrCode}
            className="mt-4 w-96 p-2 bg-white rounded-lg text-black"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}
