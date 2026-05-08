// src/hooks/fetchUsers.js
import { useQuery } from "@tanstack/react-query";

export default function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}