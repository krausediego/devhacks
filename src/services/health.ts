import { api } from "@/lib/axios";

const healthService = async () => {
  const { data } = await api.get("/health");

  console.log("DATA", data);
};

export { healthService };
