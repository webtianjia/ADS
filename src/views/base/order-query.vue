<template>
  <div class="order-query-list oreder-query">
    <br/>
    <div class="container">

      <div class="center-block search">
        <div class="input-group">
          <input class="form-control" type="text" v-model="order_no" placeholder="请输入订单号搜索">
          <div class="input-group-btn">
            <button class="btn btn-main" @click="selectable"></button>
          </div>
        </div>
      </div>

      <br/>

      <div class="center-block" style="width: 80%">
        <el-row>
          <el-col>
            <el-card style="min-height: 300px;" v-if="order != null">
              <el-row class="text-center">
                <el-card class="m-t">
                  <div class="row">
                    <div class="col-sm-15">
                      <div class="form-group">
                        <div class="control-label col-sm-3">已运输 {{shippingDays}} 天</div>
                        <div class="control-label col-sm-8">
                          {{order.provenance}}({{order.provenance_code}})
                          <template v-if="order.transit != null">
                            ――{{order.transit}}({{order.transit_code}})
                          </template>
                          ―→<span></span>{{order.destination}}({{order.destination_code}})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-15">
                      <div class="form-group">
                        <div class="control-label col-sm-3">提单号 ：{{order.bill_lading_no}}</div>
                        <div class="control-label col-sm-3">最新状态 ：{{state}}</div>
                        <div class="control-label col-sm-5">更新时间 ：{{latestTime}}</div>
                      </div>
                    </div>
                  </div>
                </el-card>
                <el-card class="m-t">
                  <el-table :data="tableData" border style="width:100%;" v-if="tableData != null">
                    <el-table-column prop="route_detail" label="状态" width="250">
                    </el-table-column>
                    <el-table-column prop="create_time" label="更新时间" width="200">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>
<script>
  import API from '../../api/base/order-query'
  import routerTrajectory from '../../components/common/router-trajectory'
  import {formatDate} from '../../assets/js/date'

  export default {
    name: "order-query",
    data() {
      return {
        latestTime: "",
        shippingDays: "",
        order_no: "",
        tableData: null,
        order: null,
        state: "",
      }
    },

    methods: {
      selectable() {
        if (this.order_no) {
          this.order_no = this.order_no.trim();
        }
        var data = {"order_no": this.order_no};
        API.selectable(data).then((response) => {
          if (response.code == 1) {
            this.tableData = response.data.orderRouteList;
            this.order = response.data.order;
            this.latestTime = response.data.latestTime;
            this.shippingDays = response.data.shippingDays;
            this.state = this.orderState(response.data.order.state);
          }
        })
      },
      /*订单状态*/
      orderState(state) {
        switch (state) {
          case 'have_order' :
            return '已下单';

          case 'in_house' :
            return '已入仓';

          case 'shipment' :
            return '已出货';

          case 'booking' :
            return '已订舱';

          case 'take_off' :
            return '已起飞';

          case 'arrive' :
            return '已到达';

          case 'delivery' :
            return '派送中';

          case 'over' :
            return '派送完结';

          case 'pick_up' :
            return '已提货';

          case 'out_house' :
            return '已退仓';

          case 'cancel' :
            return '已取消';
        }
      },

    }
  }
</script>

<style scoped lang="less">
  .oreder-query {
    background: #eff4fa url("../../../static/img/about-bg.png") no-repeat;
    min-height: 1080px;
  }

  #order {
    background-color: #ffffff;
    border: 0px;
  }

  .search {
    width: 400px;
    margin-top: 28px;
    .input-group {
      display: table;
      width: 100%;
      .form-control {
        height: 40px;
        border-radius: 4px;
        font-size: 14px;
        padding-left: 10px;
        width: 100%;
        display: table-cell;
        vertical-align: middle;
        background: transparent;
        border: 1px solid #aed1fa;
        box-sizing: border-box;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        &::placeholder {
          color: #999;
        }
      }
      .input-group-btn {
        display: table-cell;
        vertical-align: middle;
        .btn {
          width: 61px;
          height: 40px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          cursor: pointer;
          background: #0287db url("../../../static/img/search.png") no-repeat center;
        }
      }
    }
  }

</style>
