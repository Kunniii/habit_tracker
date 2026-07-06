import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { useAuthStore } from "./auth";

export const useHabitStore = defineStore("habit", {
  state: () => ({
    habits: useStorage("habit", []),
    feed: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    getHeaders() {
      const auth = useAuthStore();
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      };
    },

    // LOCAL FIRST CRUD
    addHabit(habit) {
      this.habits.push(habit);
    },
    updateHabit(id, updatedHabit) {
      const index = this.habits.findIndex((h) => h.id === id);
      if (index !== -1) {
        this.habits[index] = updatedHabit;
      }
    },
    deleteHabit(id) {
      this.habits = this.habits.filter((h) => h.id !== id);
    },
    markHabitAsDone(id, date) {
      const habit = this.habits.find((h) => h.id === id);
      if (habit) {
        if (!habit.datesDone) habit.datesDone = [];
        if (!habit.datesDone.includes(date)) {
           habit.datesDone.push(date);
        }
      }
    },
    getHabitById(id) {
      return this.habits.find(h => h.id === Number(id));
    },

    // FEED
    async fetchFeed() {
      try {
        const res = await fetch('/api/achievements/feed');
        if (res.ok) {
          const data = await res.json();
          this.feed = data;
        }
      } catch (e) {
        console.error('Failed to fetch feed:', e);
      }
    },
    shareAchievement(habitId, message) {
      // Trigger a re-fetch of the feed since we added a share via ShareModal
      this.fetchFeed();
    },

    // SYNC
    async syncHabits() {
      this.isLoading = true;
      this.error = null;
      try {
        const auth = useAuthStore();
        if (!auth.token) {
          throw new Error('Bạn cần đăng nhập để đồng bộ');
        }

        const res = await fetch('/api/habits/sync', {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(this.habits) // Send local habits to BE
        });

        if (res.ok) {
          const data = await res.json();
          this.habits = data; // Overwrite local storage with the merged data from BE
        } else {
          const errData = await res.json();
          throw new Error(errData.error || 'Đồng bộ thất bại');
        }
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.isLoading = false;
      }
    }
  },
});
