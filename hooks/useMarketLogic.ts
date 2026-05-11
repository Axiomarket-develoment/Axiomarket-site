import { useEffect, useState } from "react";
import { Template } from "@/data/market";

type Category = "Crypto" | "Meme Coins" | "Football" | "X";

interface Outcome {
  label: string;
}

export const useMarketLogic = (onSubmit: any) => {
  const [category, setCategory] = useState<Category>("X");
  const [template, setTemplate] = useState<Template | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [outcomes, setOutcomes] = useState<Outcome[]>([
    { label: "Yes" },
    { label: "No" }
  ]);

  const getDurationFromPhrase = (phrase: string) => {
    switch (phrase) {
      case "1h":
        return 60 * 60 * 1000;
      case "24h":
        return 24 * 60 * 60 * 1000;
      case "7d":
        return 7 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  };

  const getDurationEnd = (now: Date, value: string) => {
    const end = new Date(now);

    if (value?.includes("1h")) end.setHours(end.getHours() + 1);
    if (value?.includes("24h")) end.setHours(end.getHours() + 24);
    if (value?.includes("7d")) end.setDate(end.getDate() + 7);

    return end;
  };

  const buildQuestion = () => {
    if (!template) return "";

    return template.template.replace(/\{(.*?)\}/g, (_, key) => {
      return values[key] || `{${key}}`;
    });
  };

  // AUTO TIME SYNC
  useEffect(() => {
    if (!values.timePhrase) return;

    const now = new Date();
    const end = getDurationEnd(now, values.timePhrase);

    setStartDate(now.toISOString().split("T")[0]);
    setStartTime(now.toTimeString().slice(0, 5));

    setEndDate(end.toISOString().split("T")[0]);
    setEndTime(end.toTimeString().slice(0, 5));
  }, [values.timePhrase]);

  useEffect(() => {
    if (!values.timePhrase || !startDate || !startTime) return;

    const start = new Date(`${startDate}T${startTime}`);
    const duration = getDurationFromPhrase(values.timePhrase);

    if (!duration) return;

    const end = new Date(start.getTime() + duration);

    setEndDate(end.toISOString().split("T")[0]);
    setEndTime(end.toTimeString().slice(0, 5));
  }, [startDate, startTime, values.timePhrase]);

  const handleSubmit = () => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const durationMinutes = (end.getTime() - start.getTime()) / 60000;

    const question = buildQuestion();

    onSubmit({
      category,
      question,
      values,
      template,
      startDate: start,
      endDate: end,
      outcomes,
      durationMinutes
    });
  };

  return {
    category,
    setCategory,
    template,
    setTemplate,
    values,
    setValues,
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    outcomes,
    setOutcomes,
    handleSubmit
  };
};