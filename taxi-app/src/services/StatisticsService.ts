import { axiosInstance } from "@/components/utils/http";
import axios from "axios";

export interface PaginationCriteria {
    page: number,
    pageSize: number,
}

export interface FilterCriteria {
    pickupDateTime?: [Date | null, Date | null];
    passengerCount?: number[];
    tripDistance?: number[];
    fareAmount?: number[];
    paymentType?: string[];
    // Add more filter criteria as needed
}

class StatisticsService {
    getTimeSeriesAnalysisOld(filter?: FilterCriteria) {
        return axiosInstance.get<TimeSeriesAnalysisDTO>(
            `/Ride/GetTimeSeriesAnaysis`
        );
    }
    getTimeSeriesAnalysis(filter?: FilterCriteria) {
        return axios.get<TimeSeriesAnalysisDTO>(
            `http://localhost:3000/api/statistics/timeSeriesAnalysis`
        );
    }
    getTipPercentageDistribution(filter?: FilterCriteria) {
        let query = "";

        // if (filter) {
        //     if (filter.pickupDateTime?.[0] != null)
        //         query += `&pickupDateFrom=${filter.pickupDateTime[0].toDateString()}`
        //     if (filter.pickupDateTime?.[1] != null)
        //         query += `&pickupDateTo=${filter.pickupDateTime[1].toDateString()}`
        //     if (filter.passengerCount)
        //         query += `&passengerCountFrom=${filter.passengerCount[0]}&passengerCountTo=${filter.passengerCount[1]}`
        //     if (filter.fareAmount)
        //         query += `&totalAmountFrom=${filter.fareAmount[0]}&totalAmountTo=${filter.fareAmount[1]}`
        //     if (filter.tripDistance)
        //         query += `&tripDistanceFrom=${filter.tripDistance[0]}&tripDistanceTo=${filter.tripDistance[1]}`
        //     if (filter.paymentType) {
        //         let typeString = filter.paymentType.join(",")
        //         query += `&paymentType=${typeString}`
        //     }
        // }

        return axios.get<TimeSeriesAnalysisDTO>("http://localhost:3000/api/heatmap");
    }

    getHeatMapStatistics(filter?: FilterCriteria) {
        return axios.get<[[string, number]]>("http://localhost:3000/api/heatmap");
    }
    getHeatMapHourlyStatistics(hour: number, filter?: FilterCriteria) {
        return axios.get<[[string, number]]>(`http://localhost:3000/api/heatmapHourly?hour=${hour}`);
    }
    getChargeDistribution() {
        return axios.get<ChargeDistribution>("http://localhost:3000/api/statistics/chargeDistribution");
    }
    getTipPerDistanceDistribution() {
        return axios.get<[[number, number]]>("http://localhost:3000/api/statistics/tipPerDistance");
    }
    getPaymentTypeDistribution() {
        return axios.get<[[string, number]]>(`http://localhost:3000/api/statistics/paymentTypeDistribution`);
    }
    getPassengerCountDistribution() {
        return axios.get<[[number, number]]>(`http://localhost:3000/api/statistics/passengerCountDistribution`);
    }
}

export default new StatisticsService();