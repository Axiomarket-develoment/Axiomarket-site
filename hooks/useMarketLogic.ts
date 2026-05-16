import { useEffect, useState } from "react";
import { Template } from "@/data/market";

type Category = "Crypto" | "Meme Coins" | "Football" | "X";

interface Outcome {
  label: string;
}

export const useMarketLogic = () => {
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

  const parseDurationToMs = (value: string) => {
    if (!value) return 0;

    const v = value.toLowerCase().trim();

    // hours
    if (v.includes("h")) {
      const num = parseInt(v);
      return num * 60 * 60 * 1000;
    }

    // days
    if (v.includes("d")) {
      const num = parseInt(v);
      return num * 24 * 60 * 60 * 1000;
    }

    // weeks
    if (v.includes("week")) {
      const num = parseInt(v) || 1;
      return num * 7 * 24 * 60 * 60 * 1000;
    }

    // months (approx 30 days)
    if (v.includes("month")) {
      const num = parseInt(v) || 1;
      return num * 30 * 24 * 60 * 60 * 1000;
    }

    // fallback: try raw number as days
    const fallback = parseInt(v);
    if (!isNaN(fallback)) {
      return fallback * 24 * 60 * 60 * 1000;
    }

    return 0;
  };

  const getDurationEnd = (start: Date, value: string) => {
    if (!value) return start;

    const v = value.toLowerCase().trim();

    const end = new Date(start);

    // =========================
    // TOMORROW
    // =========================
    if (v === "tomorrow") {
      end.setDate(end.getDate() + 1);
      end.setHours(23, 59, 59, 999);
      return end;
    }

    // =========================
    // THIS WEEK (end of current week = Sunday)
    // =========================
    if (v === "this week" || v === "thisweek") {
      const day = end.getDay(); // 0 = Sunday
      const diff = 6 - day; // end of week (Saturday) OR change to 0 for Sunday

      end.setDate(end.getDate() + diff);
      end.setHours(23, 59, 59, 999);
      return end;
    }

    // =========================
    // NEXT WEEK
    // =========================
    if (v === "next week" || v === "nextweek") {
      const day = end.getDay();
      const diffToNextWeekStart = 7 - day;

      end.setDate(end.getDate() + diffToNextWeekStart + 6);
      end.setHours(23, 59, 59, 999);
      return end;
    }

    // =========================
    // THIS MONTH (end of month)
    // =========================
    if (v === "this month" || v === "thismonth") {
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      return end;
    }

    // =========================
    // FALLBACK: numeric durations (1h, 7d, 3months etc)
    // =========================
    const duration = parseDurationToMs(value);
    if (duration) {
      return new Date(start.getTime() + duration);
    }

    return start;
  };


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
    const end = getDurationEnd(start, values.timePhrase);

    setEndDate(end.toISOString().split("T")[0]);
    setEndTime(end.toTimeString().slice(0, 5));
  }, [startDate, startTime, values.timePhrase]);


  const buildOutcomeQuestion = (outcomes: any[]) => {
    if (!outcomes || outcomes.length === 0) return "";

    if (outcomes.length === 2) {
      return "What will be the outcome of this match?";
    }

    if (outcomes.length === 3) {
      return "What will be the result of the match?";
    }

    return "What is the possible outcome of this event?";
  };


  const handleSubmit = (style?: string) => {

    const start =
      new Date(`${startDate}T${startTime}`);

    const end =
      new Date(`${endDate}T${endTime}`);

    const durationMinutes =
      (end.getTime() - start.getTime()) / 60000;

    let question = "";

    if (category === "Football" && style === "Outcome") {
      question = buildOutcomeQuestion(outcomes);
    } else {
      question = buildQuestion();
    }
    const generatedQuestion =
      typeof values.question === "string"
        ? values.question
        : "";

    return {
      category,
      question: question || generatedQuestion,
      values,
      template,
      startDate: start,
      endDate: end,
      outcomes,
      durationMinutes
    };
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