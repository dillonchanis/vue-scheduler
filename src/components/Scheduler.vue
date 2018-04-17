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
      <div class="calendar__week" v-for="(week, i) in weeks" :key="i">
        <div class="calendar__day"
            :class="{ 'calendar__day--current': day.current, 'calendar__day--secondary': day.secondary }"
            v-for="day in week"
            @click="dayClicked(day)" 
            :key="day._id">
          {{ day.day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chunk, generateId, getMonths } from '../utils'

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
    currentMonthDays () {
      return this.getDays(this.month, 1, this.lastDayOfMonth.getDate())
    },
    weeks () {
      return chunk([...this.previousMonthDays, ...this.currentMonthDays, ...this.nextMonthDays])
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
      const nextMonth = this.month + 1
      return this.getDays(nextMonth, 1, numberOfDays)
    },
    previousMonthDays () {
      const endOfPreviousMonth = new Date(this.year, this.month, 0).getDate()
      const startRange = Number(endOfPreviousMonth) - Number(this.firstDayOfMonth) + 1
      const prevMonth = this.month - 1
      return !this.firstDayOfMonth ? [] : this.getDays(prevMonth, startRange, endOfPreviousMonth)
    },
    year () {
      return this.date.getFullYear()
    }
  },
  mounted () {
    this.months = getMonths(this.monthFormat)
  },
  methods: {
    dayClicked (day) {
      this.$emit('onDayClick', day)
    },
    getDays (month, startDay = 1, numberOfDays) {
      const days = []

      for (startDay; startDay <= numberOfDays; startDay++) {
        let thisDay = new Date(this.year, month, startDay)
        
        days.push({
          _id: generateId(),
          day: startDay,
          current: this.today.getTime() === thisDay.getTime(),
          secondary: this.date.getMonth() !== thisDay.getMonth()
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

  &__week,
  &__weeks {
    display: flex;
  }

  &__week {
    width: 100%;
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