<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="16">
        <el-card style="min-height: 327px" v-if="orderStatistical">
          <div slot="header">
            <span>XIUEX</span>
            <el-button size="small" class="pull-right" style="padding: 3px 0" type="text">
              <a href="/wrapper-content/personalInformation">账户设置</a>
            </el-button>
            <el-button size="small" class="pull-right m-r-lg" style="padding: 3px 0" type="text">
              <a href="/wrapper-content/demandList">需求管理</a>
            </el-button>
          </div>
          <el-row class="text-center m-t-lg">
            <el-col :span="4" :push="1">
              <a href="/wrapper-content/orderList">
                <p>总订单列表</p>
                <p>({{orderStatistical.order_total_num}})</p>
              </a>
            </el-col>
            <el-col :span="4" :push="1">
              <a href="/wrapper-content/demandList">
                <p>已报价</p>
                <p>({{orderStatistical.make_offers_num}})</p>
              </a>
            </el-col>
            <el-col :span="4" :push="1">
              <a href="/wrapper-content/orderList">
                <p>待出货</p>
                <p>({{orderStatistical.booking_num}})</p>
              </a>
            </el-col>
            <el-col :span="4" :push="1">
              <a href="/wrapper-content/orderList">
                <p>干线运输</p>
                <p>({{orderStatistical.transport_num}})</p>
              </a>
            </el-col>
            <el-col :span="4" :push="1">
              <a href="/wrapper-content/orderList">
                <p>已结束</p>
                <p>({{orderStatistical.over_num}})</p>
              </a>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span>最新公告</span>
            <!--<el-button style="float: right; padding: 3px 0" type="text">更多<i class="el-icon-d-arrow-right"></i>-->
            <!--</el-button>-->
          </div>
          <div class="list-group">
            <div class="list-group-item" v-for="item in noticeList">{{item.create_time | format}} ◆ {{item.notice_content}}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="m-t">
      <div slot="header" v-if="orderStatistical">
        <span class="text-danger">异常订单({{orderStatistical.exception_num}})</span>
      </div>
      <el-table
        :data="orderList"
        style="width: 100%">
        <el-table-column label="单号" width="200">
          <template slot-scope="scope">
            <p>{{scope.row.order_no}}订单号</p>
            <p>{{scope.row.bill_lading_no}}提单号</p>
          </template>
        </el-table-column>
        <el-table-column label="需求概述" width="400">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="8">起运地 {{scope.row.provenance}}</el-col>
              <el-col :span="8">{{scope.row.airline_company_name}}</el-col>
              <el-col :span="8">
                <el-popover
                  placement="top-start"
                  title="描述"
                  width="200"
                  trigger="hover"
                  :content="scope.row.info_describe">
                  <p slot="reference" class="br">{{scope.row.info_describe}}</p>
                </el-popover>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">目的地 {{scope.row.destination}}</el-col>
              <el-col :span="8"><p>{{scope.row.service_mode | service_mode}}</p></el-col>
            </el-row>
            <el-row>
              <el-col :span="8">货物重量 {{scope.row.need_weight}}KG</el-col>
              <el-col :span="8">{{scope.row.declaration_type | declaration_type}}</el-col>
              <el-col :span="8">
                <el-popover
                  placement="top-start"
                  title="备注"
                  width="200"
                  trigger="hover"
                  :content="scope.row.require_remark">
                  <p slot="reference" class="br">{{scope.row.require_remark}}</p>
                </el-popover>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="收寄人信息">
          <template slot-scope="scope">
            <div>
              <el-tag size="mini">收</el-tag>
              <span>{{scope.row.recipientName}}</span>
              <span>{{scope.row.recipientPhone}}</span>
              <p>{{scope.row.recipientAddress}}</p>
            </div>
            <div>
              <el-tag size="mini">寄</el-tag>
              <span>{{scope.row.senderName}}</span>
              <span>{{scope.row.senderPhone}}</span>
              <p>{{scope.row.senderAddress}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p>{{scope.row.state | orderState}}</p>
            <p v-if="scope.row.is_exception==1">
              <el-tag type="danger" size="mini">{{scope.row.exception_state | exception_state}}</el-tag>
            </p>
            <p v-for="item in scope.row.orderRouteList">{{item.op_time | formatDate}} {{item.route_detail}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="getOrderDetail(scope.row.id)">查看
            </el-button>
            <el-button size="mini"
                       @click="getOrderRouter(scope.row.id)">轨迹
            </el-button>
            <el-button size="mini" v-if="scope.row.is_exception==1" @click="getExceptionData(scope.row.id,scope.row)">
              异常信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="异常信息" :visible.sync="exceptionModal">
      <div>
        <el-table
          :data="exceptionData.viewData"
          style="width: 100%">
          <el-table-column label="单号" width="200">
            <template slot-scope="scope">
              <p>{{scope.row.order_no}}订单号</p>
              <p>{{scope.row.bill_lading_no}}提单号</p>
            </template>
          </el-table-column>
          <el-table-column label="运输信息" width="400">
            <template slot-scope="scope">
              <el-row>
                <el-col :span="8">起运地 {{scope.row.provenance}}</el-col>
                <el-col :span="8">{{scope.row.airline_company_name}}</el-col>
                <el-col :span="8">
                  <el-popover
                    placement="top-start"
                    title="描述"
                    width="200"
                    trigger="hover"
                    :content="scope.row.info_describe">
                    <p slot="reference" class="br">{{scope.row.info_describe}}</p>
                  </el-popover>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">目的地 {{scope.row.destination}}</el-col>
                <el-col :span="8"><p>{{scope.row.service_mode | service_mode}}</p></el-col>
              </el-row>
              <el-row>
                <el-col :span="8">货物重量 {{scope.row.need_weight}}KG</el-col>
                <el-col :span="8">{{scope.row.declaration_type | declaration_type}}</el-col>
                <el-col :span="8">
                  <el-popover
                    placement="top-start"
                    title="备注"
                    width="200"
                    trigger="hover"
                    :content="scope.row.require_remark">
                    <p slot="reference" class="br">{{scope.row.require_remark}}</p>
                  </el-popover>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="收寄人信息">
            <template slot-scope="scope">
              <div>
                <el-tag size="mini">收</el-tag>
                <span>{{scope.row.recipientName}}</span>
                <span>{{scope.row.recipientPhone}}</span>
                <p>{{scope.row.recipientAddress}}</p>
              </div>
              <div>
                <el-tag size="mini">寄</el-tag>
                <span>{{scope.row.senderName}}</span>
                <span>{{scope.row.senderPhone}}</span>
                <p>{{scope.row.senderAddress}}</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-card class="m-t">
          <div slot="header">异常信息</div>
          <el-table
            :data="exceptionData.data"
            v-if="exceptionData.data"
            style="width: 100%">
            <el-table-column label="异常状态">
              <template slot-scope="scope">
                <p>{{scope.row.exception_state | exception_state}}</p>
              </template>
            </el-table-column>
            <el-table-column label="异常备注">
              <template slot-scope="scope">
                <p>{{scope.row.exception_remarks}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作时间">
              <template slot-scope="scope">
                <p>{{scope.row.create_time | formatDate}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作人">
              <template slot-scope="scope">
                <p>{{scope.row.op_name}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="exceptionModal=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看订单信息" :visible.sync="detailModal">
      <div class="form-horizontal" v-if="orderDetail">
        <el-card>
          <div slot="header">单号信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">订单号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.order_no}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">提单号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.bill_lading_no}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">调度单</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.in_house_no}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">需求信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">线路信息</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.provenance}}-{{orderDetail.order.provenance_code}}----》{{orderDetail.order.destination}}-{{orderDetail.order.destination_code}}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">服务模式</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.service_mode | service_mode}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">清关方式</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.declaration_type | declaration_type}}</div>
                </div>
              </div>
            </div>
          </div>
          <!--<div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">起运地服务方式</div>
                <div class="col-sm-8">
                  <div class="form-control-static">上门提货</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">目的地服务方式</div>
                <div class="col-sm-8">
                  <div class="form-control-static">清关派送</div>
                </div>
              </div>
            </div>
          </div>-->
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">寄件人</div>
                <div class="col-sm-8">
                  <div class="form-control-static">
                    <p>{{orderDetail.senderInfo.person_name}} {{orderDetail.senderInfo.person_phone}} {{orderDetail.senderInfo.zip_code}}</p>
                    <p class="br">{{orderDetail.senderInfo.address}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">收件人</div>
                <div class="col-sm-8">
                  <div class="form-control-static">
                    <p>{{orderDetail.recipientInfo.person_name}} {{orderDetail.recipientInfo.person_phone}} {{orderDetail.recipientInfo.zip_code}}</p>
                    <p class="br">{{orderDetail.recipientInfo.address}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template v-if="orderDetail.order.pick_up_name != null">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <div class="control-label col-sm-4">提货信息</div>
                  <div class="col-sm-8">
                    <div class="form-control-static">
                      <p>{{orderDetail.order.pick_up_name}} {{orderDetail.order.pick_up_phone}}</p>
                      <p class="br">{{orderDetail.order.pick_up_address}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">货物信息描述</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.info_describe}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">特殊要求备注</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.require_remark}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">报价方案</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">报价航线</div>
                <div class="col-sm-8">
                  <div class="form-control-static">
                    {{orderDetail.order.provenance}}-{{orderDetail.order.provenance_code}}--{{orderDetail.orderPriceData.transit ? orderDetail.orderPriceData.transit : ''}}-{{orderDetail.orderPriceData.transit_code ? orderDetail.orderPriceData.transit_code : ''}}--》{{orderDetail.order.destination}}-{{orderDetail.order.destination_code}}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">航空公司</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.orderPriceData.airline_company_name}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">报价时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.orderPriceData.create_time}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">空运费</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.orderPriceData.shipping_price ? orderDetail.orderPriceData.shipping_price : orderDetail.orderPriceData.min_freight}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">燃油费</div>
                <div class="col-sm-8">
                  <template v-if="orderDetail.orderPriceData.fuel_surcharge != null">
                    <div class="form-control-static">{{orderDetail.orderPriceData.fuel_surcharge}}  {{orderDetail.orderPriceData.price_currency}}/KG</div>
                  </template>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">战争附加费</div>
                <div class="col-sm-8">
                  <template v-if="orderDetail.orderPriceData.war_surcharge != null">
                    <div class="form-control-static">{{orderDetail.orderPriceData.war_surcharge}}  {{orderDetail.orderPriceData.price_currency}}/KG</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">订舱信息</div>
          <!--<div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">报价航线</div>
                <div class="col-sm-8">
                  <div class="form-control-static">深圳-SZX&#45;&#45;&#45;&#45;》布拉格-RPG</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">航空公司</div>
                <div class="col-sm-8">
                  <div class="form-control-static">深圳航空</div>
                </div>
              </div>
            </div>
          </div>-->
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">航班号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.flight_no}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">提单号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.bill_lading_no}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">航班时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.flight_date | formatDate}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">提货信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">司机姓名</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.driver_name}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">司机电话</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.driver_phone}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">车牌号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.plate_no}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">入仓信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">入仓重量</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.in_house_weight}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">货物体积</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.bale_long}}*{{orderDetail.order.bale_width}}*{{orderDetail.order.bale_height}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">入仓内件</div>
                <div class="col-sm-8">
                  <div class="form-control-static">
                    <p v-for="item in orderDetail.goodsDetailList">{{item.name_zh}}*{{item.goods_num}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">入仓时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.in_house_time | formatDate}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">干线运输</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">起运时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.start_time}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">到达时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.arrive_time}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">派送时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.delivery_time}}</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">完结时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">{{orderDetail.order.end_time}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div slot="footer">
        <el-button @click="detailModal=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../../api/order/order'
  import noticeAPI from '../../api/notice/notice'
  import orderStatistical from '../../api/index/index'

  import {formatDate} from '../../assets/js/date'

  export default {
    name: "index",
    data() {
      return {
        value: [20, 50],
        pageParams: {
          length: 10,
          sizes: [10, 20, 50, 100],
          start: 0,
          total: 0,
          tabType: 6
        },
        orderList: null,//订单列表
        noticeList: null,//公告列表
        exceptionModal: false,
        detailModal: false,
        exceptionData: {
          viewData: [],
          data: null
        },//异常信息
        orderDetail: null,
        orderStatistical: null,
      }
    },
    methods: {
      /*获取订单列表*/
      getOrderList() {
        API.list(this.pageParams).then((response => {
          if (response.code == 1) {
            this.pageParams.total = response.data.recordsTotal;
            this.orderList = response.data.list
//            console.log(response.data.list)
          }
        }))
      },
      /*查看订单详情*/
      getOrderDetail(id) {
        API.orderDetails({id: id}).then((response => {
          if (response.code == 1) {
            this.orderDetail = response.data;
            this.detailModal = true;
          }
//          console.log(response.data)
        }))
      },
      /*获取异常信息*/
      getExceptionData(id, row) {
        API.getExceptionData({id: id}).then((response => {
          if (response.code == 1) {
            this.exceptionData.viewData = [row];
            this.exceptionData.data = response.data;
            console.log(response.data)
            this.exceptionModal = true;
          }
        }))
      },
      /*每页显示几条啊*/
      pageSizeChange(val) {
        this.pageParams.length = val
        this.getOrderList()
      },
      /*当前第几页*/
      pageCurrentChange(val) {
        this.pageParams.start = (val - 1) * this.pageParams.length;
        this.getOrderList()
      },
      /*公告列表*/
      getNoticeList() {
        noticeAPI.list().then((response => {
          if (response.code == 1) {
            this.noticeList = response.data.list
//            console.log(response.data.list)
          }
        }))
      },
      /*订单统计*/
      getOrderStatistical() {
        orderStatistical.orderStatistical().then((response => {
          if (response.code == 1) {
            this.orderStatistical = response.data;
            console.log(response.data)
          }
        }))
      },
    },
    created() {
      this.getOrderList()
      this.getNoticeList()
      this.getOrderStatistical()
    },
    filters: {
      /*服务模式*/
      service_mode(mode) {
        switch (mode) {
          case 'door_to_door':
            return '门对门';
          case 'door_to_port':
            return '门对港';
          case 'port_to_door':
            return '港对门';
          case 'port_to_port':
            return '港对港';
        }
      },

      /*报关方式*/
      declaration_type(type) {
        switch (type) {
          case 'autonomy':
            return '自主报关';
          case 'entrust':
            return '委托报关';
        }
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

      /*异常状态*/
      exception_state(state) {
        switch (state) {
          case 'content_wrong':
            return '内件不符';

          case 'overweight':
            return '超重';

          case 'embargo':
            return '禁运';
        }
      },

      /*时间格式转换*/
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      format(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd')
      }
    }
  }
</script>

<style scoped>

</style>
