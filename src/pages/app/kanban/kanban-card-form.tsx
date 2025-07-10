import { useFormContext } from "react-hook-form";

import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { CardFormProps } from "./kanban-column";

const KanbanCardForm = () => {
  const form = useFormContext<CardFormProps>();

  return (
    <>
      <FormField
        name="title"
        control={form.control}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Task title..."
                  autoFocus
                  aria-label="Task title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Editor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {/* <FormField
        name="description"
        control={form.control}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description (optional)..."
                  aria-label="Task description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      /> */}
      <DialogFooter>
        <Button type="submit">Add Task</Button>
      </DialogFooter>
    </>
  );
};

export { KanbanCardForm };
