import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useHabitStore = defineStore("habit", {
  state: () => ({
    habits: useStorage("habit", []),
  }),
  actions: {
    addHabit(habit) {
      this.habits.push(habit);
    },
    updateHabit(id, updatedHabit) {
      const index = this.habits.findIndex((habit) => habit.id === id);
      if (index !== -1) {
        this.habits[index] = updatedHabit;
      }
    },
    deleteHabit(id) {
      this.habits = this.habits.filter((habit) => habit.id !== id);
    },
    markHabitAsDone(id, date) {
      const habit = this.habits.find((habit) => habit.id === id);
      if (habit) {
        habit.datesDone.push(date);
      }
    },
    getHabitById(id) {
      let habit = this.habits.find((habit) => {
        return habit.id === id;
      });
      console.log(habit);
      return habit;
    },
  },
});
