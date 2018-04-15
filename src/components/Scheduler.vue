<template>
  <div class="calendar">
    <div class="calendar__header">
      <button class="btn mr-4" @click="previousMonth">Prev</button>
      <h3 class="title">{{ monthName }} {{ year }}</h3>
      <button class="btn ml-4" @click="nextMonth">Next</button>
    </div>
    <div class="calendar__weeks">
      <div v-for="day in daysOfWeek" :key="day" class="calendar__day-of-week">  
        {{ day }}
      </div>
    </div>
    <div class="calendar__body">
      <div class="calendar__day calendar__day--secondary" 
          v-for="day in previousMonthDays" 
          :key="day._id">
        {{ day.day }}
      </div>
      <div class="calendar__day"
          :class="{ 'calendar__day--current': day.current }"
          v-for="day in days" 
          :key="day._id">
        {{ day.day }}
      </div>
      <div class="calendar__day calendar__day--secondary"
           v-for="day in nextMonthDays"
           :key="day._id">
          {{ day.day }}
      </div>
    </div>
  </div>
</template>

<script>
import { generateId, getMonths } from '../utils'

export default {
  name: 'scheduler',
  props: {
    daysOfWeek: {
      type: Array,
      default: () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    min: {
      type: Date,
      default: () => new Date(1980, 0, 1)
    },
    max: {
      type: Date,
      default: () => new Date(2040, 11, 31)
    },
    monthFormat: {
      type: String,
      default: 'long',
      validator: val => ['long', 'short'].includes(val)
    }
  },
  data () {
    return {
      months: [],
      today: new Date(new Date().setHours(0,0,0,0)),
      date: new Date()
    }
  },
  computed: {
    days () {
      return this.getDays(this.lastDayOfMonth.getDate())
    },
    firstDayOfMonth () {
      return new Date(this.year, this.month, 1).getDay()
    },
    lastDayOfMonth () {
      return new Date(this.year, this.month + 1, 0)
    },
    month () {
      return this.date.getMonth()
    },
    monthName () {
      return this.months[this.date.getMonth()]
    },
    nextMonthDays () {
      const numberOfDays = 6 - this.lastDayOfMonth.getDay()
      return this.getDays(numberOfDays)
    },
    previousMonthDays () {
      const endOfPreviousMonth = new Date(this.year, this.month, 0).getDate()
      const startRange = Number(endOfPreviousMonth) - Number(this.firstDayOfMonth) + 1
      return !this.firstDayOfMonth ? 0 : this.getDays(endOfPreviousMonth, startRange)
    },
    year () {
      return this.date.getFullYear()
    }
  },
  mounted () {
    this.months = getMonths(this.monthFormat)
  },
  methods: {
    getDays (numberOfDays, startDay = 1) {
      const days = []

      for (startDay; startDay <= numberOfDays; startDay++) {
        days.push({
          _id: generateId(),
          day: startDay,
          current: this.today.getTime() === new Date(this.year, this.month, startDay).getTime()
        })
      }

      return days
    },
    nextMonth () {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1)
      
      this.$emit('nextMonth', this.date)
    },
    previousMonth () {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1)
      
      this.$emit('previousMonth', this.date)
    }
  }
}
</script>

<style lang="scss" scoped>
.mr-4 {
  margin-right: 1em;
}

.ml-4 {
  margin-left: 1em;
}

.calendar {
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__weeks {
    display: flex;
  }

  &__body {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }

  &__day-of-week,
  &__day {
    width: 14%;
  }

  &__day {
    background-color: #fff;
    height: 150px;
    border: 1px solid #ccc;
    transition: background-color 0.15s ease;

    &--secondary {
      background-color: #ddd;
    }

    &--current {
      background-color: cornflowerblue;
    }

    &:hover {
      background-color: #ddd;
    }
  }
}

.btn {
  color: #333;
  border: none;
  border-radius: 4px;
  background-color: #dae1e7;
  padding: 1em 2em;
  cursor: pointer;
}
</style>