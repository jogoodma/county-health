import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import { scaleOrdinal } from "@visx/scale";
import { LegendOrdinal } from "@visx/legend";

export interface NationalWasteWaterItem {
  date: string;
  rolling_avg: number;
}
export interface NationalWasteWater {
  [key: string]: NationalWasteWaterItem[];
}

interface NationalWasteWaterProps {
  averages: NationalWasteWater;
}

const accessors = {
  xAccessor: (d: NationalWasteWaterItem) => d?.date,
  yAccessor: (d: NationalWasteWaterItem) => d?.rolling_avg,
};

const yAxisLabelFormatter = (value: number) => {
  return `${value}`;
};

const NationalWasteWater = ({ averages }: NationalWasteWaterProps) => {
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
          tickFormat={yAxisLabelFormatter}
          label="Average COVID Conc."
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
              const numCases = accessors.yAccessor(
                tooltipData.nearestDatum.datum
              );
              return (
                <div>
                  <div
                    style={{
                      color: ordinalColorScale(tooltipData.nearestDatum.key),
                    }}
                  >
                    {tooltipData.nearestDatum.key}
                  </div>
                  {accessors.xAccessor(tooltipData.nearestDatum.datum)}
                  {": "}
                  {new Intl.NumberFormat().format(Math.round(numCases))}
                </div>
              );
            }
            return null;
          }}
        />
      </XYChart>
      <LegendOrdinal scale={ordinalColorScale} labelMargin="0 15px 0 0" />
    </div>
  );
};
export default NationalWasteWater;
