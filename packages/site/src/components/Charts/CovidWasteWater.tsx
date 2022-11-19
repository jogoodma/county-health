import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import { scaleOrdinal } from "@visx/scale";
import { LegendOrdinal } from "@visx/legend";
import { format } from "d3-format";

export interface WasteWaterItem {
  date: string;
  rolling_avg: number;
}
export interface WasteWater {
  [key: string]: WasteWaterItem[];
}

interface CovidWasteWaterProps {
  averages: WasteWater;
}

const accessors = {
  xAccessor: (d: WasteWaterItem) => d?.date,
  yAccessor: (d: WasteWaterItem) => d?.rolling_avg,
};

const yAxisLabelFormatter = (value: number) => {
  return `${value}`;
};

const CovidWasteWater = ({ averages }: CovidWasteWaterProps) => {
  const regionNames = Object.keys(averages);
  const ordinalColorScale = scaleOrdinal({
    domain: regionNames,
    range: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"],
  });
  return (
    <div className="flex flex-row">
      <XYChart
        height={400}
        xScale={{ type: "band" }}
        yScale={{ type: "linear" }}
      >
        <AnimatedAxis orientation="bottom" label="Date" />
        <AnimatedAxis
          orientation="left"
          tickFormat={format("~s")}
          label="Average COVID Conc. (copies / mL)"
          labelOffset={15}
        />
        <AnimatedGrid columns={false} numTicks={4} />
        {regionNames.map((region) => (
          <AnimatedLineSeries
            key={region}
            dataKey={region}
            data={averages[region]}
            {...accessors}
            stroke={ordinalColorScale(region)}
          />
        ))}
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showVerticalCrosshair
          showSeriesGlyphs
          renderTooltip={({ tooltipData }) => {
            if (tooltipData) {
              const regions = Object.keys(tooltipData.datumByKey);
              return regions.map((region) => {
                const regionalDataPoint = tooltipData.datumByKey[region]
                  .datum as WasteWaterItem;
                const numCases = accessors.yAccessor(regionalDataPoint);
                return (
                  <div className="h-8" key={region}>
                    <div
                      style={{
                        color: ordinalColorScale(region),
                      }}
                    >
                      {region}
                    </div>
                    {accessors.xAccessor(regionalDataPoint)}
                    {": "}
                    {new Intl.NumberFormat().format(Math.round(numCases))}
                  </div>
                );
              });
            }
            return null;
          }}
        />
      </XYChart>
      <LegendOrdinal scale={ordinalColorScale} labelMargin="0 15px 0 0" />
    </div>
  );
};
export default CovidWasteWater;
