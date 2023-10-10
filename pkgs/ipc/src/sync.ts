export type SyncVarInterface<Name extends string, Type, Cate extends 'main' | 'renderer'> = {
  [key in `${Cate}.var.${Name}`]: (nv: Type) => void
}

export type SyncVarInfo_M2R = [
  ['test', string],
  [
    'deep',
    {
      value: string
    }
  ]
]

export type SyncVarInfo_R2M = [
  ['test', string],
  [
    'deep',
    {
      value: string
    }
  ]
]

export type SyncVarNameList<I, KS extends unknown[] = []> = I extends [infer X, ...infer Y]
  ? X extends [infer N, ...infer R]
    ? SyncVarNameList<Y, [...KS, N]>
    : never
  : KS

export type SyncVarNameList_M2R = SyncVarNameList<SyncVarInfo_M2R>
export type SyncVarNameList_R2M = SyncVarNameList<SyncVarInfo_R2M>

export type SyncVarMap<I, R extends unknown = {}> = I extends [infer X, ...infer Y]
  ? X extends [infer N, infer T]
    ? N extends string
      ? SyncVarMap<
          Y,
          R & {
            [key in N]: T
          }
        >
      : never
    : never
  : R

export type SyncVarMap_M2R = SyncVarMap<SyncVarInfo_M2R>
export type SyncVarMap_R2M = SyncVarMap<SyncVarInfo_R2M>

export type SyncVarName_M2R = keyof SyncVarMap_M2R
export type SyncVarName_R2M = keyof SyncVarMap_R2M

export type SyncVarInterfaceList_M2R<
  KS extends string[] = SyncVarNameList_M2R,
  T extends unknown = {}
> = KS extends [infer N, ...infer R]
  ? R extends string[]
    ? N extends SyncVarName_M2R
      ? SyncVarInterfaceList_M2R<R, T & SyncVarInterface<N, SyncVarMap_M2R[N], 'renderer'>>
      : never
    : never
  : T

export type SyncVarInterfaceList_R2M<
  KS extends string[] = SyncVarNameList_R2M,
  T extends unknown = {}
> = KS extends [infer N, ...infer R]
  ? R extends string[]
    ? N extends SyncVarName_R2M
      ? SyncVarInterfaceList_R2M<R, T & SyncVarInterface<N, SyncVarMap_R2M[N], 'main'>>
      : never
    : never
  : T