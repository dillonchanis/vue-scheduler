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
      <div class="calendar__day" v-for="d in firstDayOfMonth" :key="d">&nbsp;</div>
      <div class="calendar__day" v-for="date in days" :key="date._id">
        {{ date.day }}
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
      default: () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
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
      today: new Date(),
      date: new Date()
    }
  },
  computed: {
    firstDayOfMonth () {
      return new Date(this.year, this.month, 1)
    },
    lastDayOfMonth () {
      return new Date(this.year, this.month + 1, 0)
    },
    days () {
      const numberOfDays = new Date(this.year, this.month + 1, 0).getDate()
      const days = []

      for (let day = 1; day <= numberOfDays; day++) {
        days.push({
          _id: generateId(),
          day
        })
      }

      return days
    },
    month () {
      return this.date.getMonth()
    },
    monthName () {
      return this.months[this.date.getMonth()]
    },
    week () {
    },
    year () {
      return this.date.getFullYear()
    }
  },
  mounted () {
    this.months = getMonths(this.monthFormat)
  },
  methods: {
    nextMonth () {
      this.date = this.date.getMonth() === 11 
        ? new Date(this.date.getFullYear() + 1, 0, 1)
        : new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1)
      
      this.$emit('nextMonth', this.date)
    },
    previousMonth () {
      this.date = this.date.getMonth() === 11 
        ? new Date(this.date.getFullYear() - 1, 0, 1)
        : new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1)
      
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
  }

  &__weeks {
    display: flex;
  }

  &__body {
    display: flex;
    width: 100%;
  }

  &__day-of-week,
  &__day {
    width: 14%;
  }

  &__day {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
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