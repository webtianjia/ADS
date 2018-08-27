<template>
  <dl class="dl-horizontal router-trajectory" style="max-height: 305px;overflow-y: scroll">
    <dd v-for="(item,$index) in orderRouteList">
      <div :class="{'active':$index==0}">
        <i class="el-icon-refresh"></i>
        <template v-if="item.route_code == '007'">
          <span class="text">{{item.route_detail}}</span>
          <span class="m-l-lg">{{item.start_time | formatDate}}</span>
        </template>
        <template v-else-if="item.route_code == '008'">
          <span class="text">{{item.route_detail}}</span>
          <span class="m-l-lg">{{item.arrive_time | formatDate}}</span>
        </template>
        <template v-else-if="item.route_code == '010'">
          <span class="text">{{item.route_detail}}</span>
          <span class="m-l-lg">{{item.delivery_time | formatDate}}</span>
        </template>
        <template v-else-if="item.route_code == '014'">
          <span class="text">{{item.route_detail}}</span>
          <span class="m-l-lg">{{item.oneself_take_time | formatDate}}</span>
        </template>
        <template v-else>
          <span class="text">{{item.route_detail}}</span>
          <span class="m-l-lg">{{item.op_time | formatDate}}</span>
        </template>
      </div>
    </dd>
  </dl>
</template>

<script>
  import {formatDate} from '../../assets/js/date'

  export default {
    name: "router-trajectory",
    props: {
      orderRouteList: {
        type: Array,
        default: []
      }
    },
    filters: {
      /*时间格式转换*/
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style scoped lang="less">
  /*路由轨迹*/
  .router-trajectory {
    dd, dt {
      color: #868c98;
      .text {
        margin-left: 35px;
      }
    }
    .active {
      color: #3393ff;
      .el-icon-refresh {
        color: #3393ff;
        &:after {
          display: none;
        }
      }
    }
    .el-icon-refresh {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        width: 1px;
        height: 22px;
        background-color: #868c98;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, -50%);
      }
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      min-width: 90px;
    }
  }
</style>
