import { z } from "zod";
import { ItemSchema, PricePointSchema, SourceSchema } from "./schema";

export type Item = z.infer<typeof ItemSchema>;
export type PricePoint = z.infer<typeof PricePointSchema>;
export type Source = z.infer<typeof SourceSchema>;
