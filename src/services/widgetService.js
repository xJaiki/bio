import { supabase } from "./supabaseClient";

export const addWidget = async (widget) => {
  const { data, error } = await supabase
    .from("widgets")
    .insert(widget)
    .single();

  if (error) {
    throw error;
  }
  return data;
};
