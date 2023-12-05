import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../utils/context/AuthContext";
import { AuthContextProps } from "../types";
import { Navigate } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import TreasureKoiiImg from "../components/TreasureKoiiImg";

const CreateHunt: React.FC = () => {
  const [huntName, setHuntName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | undefined>(undefined);
  const [skips, setSkips] = useState<number>(0);

  const [message, setMessage] = useState<string | null>(null);

  const onDateChange = (dates: [Date | null, Date | null]): void => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const onSkipsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val: string = e.target.value;
    if (/^\d+$/.test(val)) setSkips(parseInt(val));
  };

  useEffect(() => {
    if (!imgFile) {
      setImgPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(imgFile);
    setImgPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imgFile]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", huntName);
    formData.append("description", description);
    if (startDate) formData.append("start_date", startDate?.toJSON());
    if (endDate) formData.append("end_date", endDate?.toJSON());
    formData.append("poster_img", imgFile as Blob);
    formData.append("number_of_skips_for_each_team", skips.toString());

    try {
      const response = await axios.post("hunts/", formData);
      const data = response.data;

      if (response.status === 201) {
        console.log("Hunt Created");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.log(error);
      setMessage("An error occured during hunt creation. Please try again.");
    }
  };

  let contextData = useContext(AuthContext);
  if (!contextData) {
    return null;
  }
  const { user }: AuthContextProps = contextData;

  return (
    <div>
      <TreasureKoiiImg />
      {!user && <Navigate to="/login" />}
      <p>Create A Hunt</p>
      {message && <p>{message}</p>}
      <form id="createHuntForm" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Hunt Name"
          value={huntName}
          onChange={(e) => setHuntName(e.target.value)}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <DatePicker
          placeholderText="Hunt Duration"
          selected={startDate}
          onChange={onDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
        />

        <label htmlFor="skips">Number of Skips</label>
        <input
          type="number"
          id="skips"
          name="number_of_skips_for_each_team"
          value={skips}
          onChange={onSkipsChange}
        />

        <label htmlFor="posterImg">Poster Image</label>
        <input
          type="file"
          id="posterImg"
          name="poster_image"
          onChange={(e) => {
            setImgFile(e.target.files ? e.target.files.item(0) : null);
          }}
        />
        {imgPreview && <img src={imgPreview} alt="Poster" />}

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateHunt;
