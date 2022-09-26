<script>
import { coding } from '~/../docs/data/resume.json'

let maxDayTime = 0
let maxRange = 0
let maxWeekTime = 0

for (let i = 0; i < coding.daytime.length; i++) {
  const element = coding.daytime[i]
  if (maxDayTime < element) {
    maxDayTime = element
    maxRange = i
  }
}

for (const day of coding.weektime) {
  if (maxWeekTime < day) maxWeekTime = day
}

const weekDay = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
export default {
  data: () => ({ coding, maxDayTime, maxRange, maxWeekTime }),
  methods: {
    parseTime (seconds = 0) {
      return `${seconds > 60 * 60 ? `${parseInt(seconds / 60 / 60)}h ` : ''}${parseInt(seconds / 60 % 60)}m`
    },
    dayOfWeek (i = 0) {
      return weekDay[i]
    }
  }
}
</script>
<template>
  <section class="section-wrapper section-coding-daytime d-print-none">
    <div class="row">
      <div class="col-lg-9 col-md-11">
        <div class="section-title">
          <h2>Daytime</h2>
        </div>
      </div>
      <div class="col-lg-27 col-md-25 col-sm-36">
        <div class="row">
          <div class="col-sm-36 col-lg-18">
            <table id="charts-daytime" class="
              charts-css
              column
              show-heading
              data-spacing-2
              datasets-spacing-3
              hide-data
              show-labels
            ">
              <caption>I'm most productive during</caption>
              <thead>
                <tr>
                  <th> Night </th>
                  <th> Morning </th>
                  <th> Daytime </th>
                  <th> Evening </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row"> Morning </th>
                  <td
                    v-for="i in 6"
                    :key="i"
                    :style="{ '--size': `calc( ${coding.daytime[i + 5] * 100 / maxDayTime} / 100 )`}"
                    class="day"
                  />
                </tr>
                <tr>
                  <th scope="row" class="highlight"> Daytime </th>
                  <td
                    v-for="i in 6"
                    :key="i"
                    :style="{ '--size': `calc( ${coding.daytime[i + 11] * 100 / maxDayTime} / 100 )`}"
                    class="day"
                  />
                </tr>
                <tr>
                  <th scope="row"> Evening </th>
                  <td
                    v-for="i in 6"
                    :key="i"
                    :style="{ '--size': `calc( ${coding.daytime[i + 17] * 100 / maxDayTime} / 100 )`}"
                    class="night"
                  />
                </tr>
                <tr>
                  <th scope="row"> Night </th>
                  <td
                    v-for="i in 6"
                    :key="i"
                    :style="{ '--size': `calc( ${coding.daytime[i - 1] * 100 / maxDayTime} / 100 )`}"
                    class="night"
                  />
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-sm-36 col-lg-18">
            <table id="charts-weektime" class="
              charts-css
              column
              data-spacing-1
              datasets-spacing-1
              hide-data
              show-labels
            ">
              <tbody>
                <tr v-for="(e, i) of coding.weektime" :key="i">
                  <th scope="row" :class="{ 'highlight': maxWeekTime === e }" v-text="dayOfWeek(i)" />
                  <td :style="{ '--size': `calc( ${e * 100 / maxWeekTime} / 100 )`}" :class="{ 'highlight': maxWeekTime === e }"/>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
#charts-daytime, #charts-weektime {
  max-width: 95%;
  margin: 0 auto;
}
#charts-daytime {
  margin-top: 1.5em;
  height: 184px;
}
#charts-weektime {
  margin-top: 1.5em;
  height: 160px;
}

table.charts-css {
  > caption {
    font-size: .85rem;
    position: absolute;
    margin-top: -2em;
  }
  > tbody {
    td.night {
      --color: #767676;
    }
    td.day {
      --color: #c7c7c7;
    }
    td {
      --color: #d9d9d9;
    }
    tr {
       > th[scope="row"] {
        border-top: 2px solid var(--text-secondary);
        &.highlight {
          border-top: 2px solid var(--text-color-link);
          color: var(--text-color-link);
        }
      }
      > td {
        &.highlight {
          --color: #767676;
          color: var(--text-color-link);
        }
      }
    }
  }
}
</style>
