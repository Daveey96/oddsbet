import { condition } from "@/helpers";
import React from "react";

function Svg({ id = 1, size = "13px", className = undefined }) {
  const { viewBox = "24", path } = condition(
    id,
    [1, 2, 3, 4, 5, 6, 7, 8],
    [
      {
        viewBox: "72.371",
        path: (
          <path d="m23.913 4.9736c-4.2085 1.7063-7.9848 4.2151-11.223 7.4524-3.2391 3.2382-5.7451 7.0155-7.4523 11.223-1.6481 4.0651-2.4844 8.3609-2.4844 12.767 0 4.4054 0.83626 8.7012 2.4844 12.764 1.7072 4.2086 4.2141 7.9858 7.4523 11.223 3.2382 3.2392 7.0135 5.7461 11.223 7.4524 4.0651 1.65 8.3598 2.4835 12.766 2.4835 4.4063 0 8.7001-0.83627 12.765-2.4835 4.2076-1.7063 7.9857-4.2132 11.223-7.4524 3.2391-3.2373 5.746-7.0127 7.4523-11.223 1.6481-4.0632 2.4825-8.359 2.4825-12.764 0-4.4064-0.83532-8.7021-2.4825-12.767-1.7063-4.2076-4.2151-7.9858-7.4523-11.223-3.2372-3.2373-7.0117-5.7461-11.223-7.4524-4.0651-1.6472-8.3589-2.4826-12.765-2.4826-4.4063 0-8.7011 0.83534-12.766 2.4826zm-12.681 45.724c-1.6341-1.0257-3.1397-2.2069-4.4729-3.5982-2.0363-5.7302-2.3813-11.934-1.0322-17.822 0.6347-1.2516 1.3566-2.4535 2.1732-3.6048 0.25219-0.35532 0.48563-0.72564 0.75564-1.0707l7.6557 4.5301v0.19219c-0.01969 4.1176 0.39844 8.2052 1.231 12.234 0.0029 0.01875 0.0056 0.02906 0.0093 0.04594l-5.9373 9.3096c-0.12934-0.06563-0.25778-0.13688-0.38246-0.21563zm22.763 15.738c1.321 0.67408 2.6794 1.2432 4.0754 1.7063-5.9298 0.25782-11.919-1.1316-17.213-4.1692l12.834 2.2866c0.09844 0.06281 0.19875 0.12282 0.30376 0.17626zm-0.04688-2.3166-15.145-2.6991c-1.7719-2.1516-3.3657-4.4279-4.7354-6.8608-0.34875-0.61877-0.73782-1.2197-1.0331-1.8657l5.9316-9.3003c0.13125 0.03281 0.2775 0.0675 0.44344 0.11157 3.7107 0.99284 7.487 1.6988 11.29 2.2519 0.22219 0.03094 0.40782 0.05813 0.56626 0.075l7.1101 12.294c-1.2338 1.7344-2.4816 3.4595-3.7566 5.1658-0.21188 0.28407-0.43688 0.55689-0.67126 0.82784zm25.197-5.237c-1.2056 1.2066-2.4853 2.2941-3.8251 3.2635-0.22219-1.7757-0.60563-3.5157-1.1466-5.2155l7.5864-14.153c2.0897-0.95159 4.1054-2.0307 5.9766-3.3685 0.24469-0.17344 0.44813-0.36751 0.60563-0.57939-0.54938 7.3136-3.615 14.472-9.197 20.053zm-0.33656-18.355c0.28219 0.53814 0.56063 1.0819 0.84001 1.6332l-7.3276 13.669c-0.04219 0.0094-0.08251 0.01875-0.12469 0.02437-3.961 0.73971-7.9539 1.1335-11.98 1.1522l-7.3126-12.644c1.1381-2.1132 2.266-4.2348 3.3844-6.3574 0.75938-1.44 1.5056-2.8895 2.251-4.3379l15.134-1.5544c1.8535 2.7188 3.6094 5.4958 5.1357 8.4152zm-3.0704-16.214c-0.71814 1.8966-1.4869 3.7735-2.251 5.6542l-14.743 1.5141c-0.17625-0.23251-0.35907-0.46126-0.55126-0.67971-1.741-1.9716-3.4932-3.931-5.2426-5.8961 0.01594-0.01969 0.03188-0.03469 0.04781-0.0525-0.70595-0.70502-1.4138-1.41-2.1197-2.1169l4.1044-12.358c0.28313-0.075 0.56813-0.13782 0.85595-0.16875 2.2313-0.22688 4.4654-0.48376 6.7023-0.61314 1.3697-0.076877 2.7469-0.12094 4.1401-0.022501l10.155 11.446c-0.34969 1.1044-0.69095 2.2116-1.0978 3.2926zm3.4069-10.365c2.8013 2.8032 4.9707 6.002 6.5045 9.4193-1.8975-1.306-3.9263-2.3804-6.0591-3.256-0.33188-0.13688-0.6722-0.25782-1.0181-0.37688l-9.9958-11.266c0.06937-0.48658 0.10594-0.97409 0.12094-1.4654 3.8026 1.5479 7.367 3.8654 10.448 6.9452zm-32.64-7.5368c0.03938 0.029063 0.05813 0.053439 0.08063 0.060002 2.2847 0.7894 4.3632 1.9519 6.3226 3.331l-3.8344 11.548c-0.01969 0.0056-0.03844 0.01125-0.05719 0.01969-0.7847 0.32438-1.5844 0.61502-2.3569 0.96659-3.1829 1.4466-6.286 3.0488-9.2092 4.9698l-7.5667-4.4767c0.01125-0.23626 0.051563-0.47626 0.13219-0.69002 0.50813-1.3538 1.0078-2.7151 1.5825-4.0417 0.4425-1.0219 0.94689-2.0091 1.4972-2.9738 0.36-0.39751 0.73313-0.79127 1.1175-1.1757 3.5935-3.5926 7.8404-6.1436 12.362-7.6521-0.02344 0.036564-0.04781 0.075002-0.07032 0.11532z" />
        ),
      },
      {
        viewBox: "256",
        path: (
          <path d="m248.33 127.21a13.227 13.227 0 0 0 5e-3 -2.7708 119.77 119.77 0 0 0-118.75-118.74c-0.44096-0.045034-0.88788-0.069445-1.3406-0.070534h-0.0238a13.597 13.597 0 0 0-1.402 0.07487 119.77 119.77 0 0 0-118.34 118.35 13.464 13.464 0 0 0-0.07389 1.4128c8.11e-4 0.44652 0.02536 0.88705 0.06889 1.3222a119.78 119.78 0 0 0 118.78 118.77c0.43077 0.0429 0.86697 0.0678 1.3089 0.0689h0.0239a13.432 13.432 0 0 0 1.3932-0.0738 119.77 119.77 0 0 0 118.35-118.34zm-185.92-67.58a92.805 92.805 0 0 1 51.312-26.118 93.357 93.357 0 0 1-77.431 77.43 92.806 92.806 0 0 1 26.118-51.312zm-26.467 78.29a119.11 119.11 0 0 0 70.465-34.292 119.11 119.11 0 0 0 34.292-70.465 93.06 93.06 0 0 1 80.17 80.17 120.05 120.05 0 0 0-104.76 104.76 93.061 93.061 0 0 1-80.17-80.171zm107.15 79.822a93.357 93.357 0 0 1 77.431-77.43 93.043 93.043 0 0 1-77.431 77.43z" />
        ),
      },
      {
        path: (
          <>
            <path
              d="m17.035 3.1347-5.0532 8.7891-5.0531 8.792c3.1286 1.8422 7.0003 1.8595 10.145 0.04524 3.1446-1.8142 5.0806-5.1818 5.0726-8.8244-0.0078-3.6425-1.9585-7.0014-5.1113-8.8018z"
              clipRule="evenodd"
              fillRule="evenodd"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.198"
              fill="none"
            />
            <path d="m2.2625 6.3159c-0.30029 0.52373-0.11017 1.1867 0.42465 1.4808 0.53482 0.29414 1.2118 0.1079 1.5122-0.41585zm7.6371-3.2078c0.59602-0.14205 0.96148-0.73031 0.81651-1.3139-0.14512-0.58362-0.74573-0.94158-1.3418-0.79953zm-5.7017 4.275c0.30162-0.52301 0.11318-1.1864-0.4209-1.4819-0.53408-0.29543-1.2115-0.11085-1.5132 0.41216zm-2.9672 7.7454c0.17183 0.5767 0.78845 0.90762 1.3773 0.73941 0.5888-0.16821 0.92683-0.77203 0.755-1.3487zm2.5662-9.216c-0.52774-0.3061-1.209-0.13528-1.5215 0.38154-0.31258 0.5168-0.13814 1.1839 0.38961 1.49zm8.1848 6.0111-0.56596 0.93575 2.97e-4 2.9e-4zm1.9363 2.3861c0.52791 0.30583 1.2091 0.13486 1.5215-0.3821 0.3123-0.51682 0.13772-1.1839-0.39019-1.4898zm-3.2942-12.757c-0.28135-0.53374-0.95127-0.74309-1.4962-0.46758-0.54504 0.2755-0.75882 0.93153-0.47748 1.4653zm-1.1414 8.921-0.96767-0.53364-4.886e-4 8.701e-4zm-7.2276 3.2636c-0.61292 0.02262-1.091 0.52769-1.0677 1.1279 0.023219 0.6002 0.53892 1.0684 1.1519 1.0457zm7.1169-12.742c-0.59559 0.14353-0.95962 0.73269-0.81305 1.316 0.14655 0.58324 0.7482 0.93972 1.3438 0.79619zm7.6634 2.1393 0.9677 0.53351c0.29601-0.5148 0.11817-1.1668-0.40056-1.4685zm-10.106 17.581-0.56463 0.93662c0.25705 0.14864 0.56439 0.18953 0.85269 0.11383 0.2883-0.07584 0.5333-0.26218 0.67973-0.51696zm-3.5647-6.1937c-0.17034-0.57714-0.78608-0.90965-1.3753-0.74289-0.58925 0.16676-0.92885 0.76986-0.75852 1.3469zm18.347-4.4116c0.6129-0.02277 1.0911-0.52784 1.0678-1.128-0.02325-0.60023-0.53901-1.0684-1.1519-1.0456zm-8.1959 2.7307c-0.30046 0.52363-0.11062 1.1868 0.4241 1.481 0.53486 0.29423 1.2119 0.10818 1.5123-0.41545zm1.9358 1.0665c0.30105-0.52334 0.1118-1.1866-0.42262-1.4814-0.53442-0.29466-1.2117-0.10934-1.5126 0.414zm-2.109 8.3888c0.28135 0.53364 0.95127 0.74303 1.4963 0.46737 0.54493-0.27552 0.75876-0.93154 0.47726-1.4652zm1.7072-9.8584c-0.52776-0.30612-1.2089-0.13515-1.5215 0.38167-0.3126 0.51682-0.13801 1.1839 0.38975 1.49zm5.1197 5.4969c0.52776 0.30597 1.2091 0.13515 1.5215-0.38167 0.3126-0.51682 0.13801-1.184-0.38975-1.49zm-15.97-10.554c1.2383-2.1595 3.3034-3.7014 5.7002-4.2727l-0.52525-2.1134c-3.0075 0.71686-5.578 2.6463-7.1118 5.3211zm-1.9354-1.0673c-1.5409 2.672-1.9136 5.8607-1.0332 8.815l2.1322-0.60933c-0.71342-2.394-0.41003-4.9772 0.83504-7.1361zm0.40107 1.4705 8.7508 5.0753 1.1319-1.8715-8.7508-5.0754zm8.7511 5.0756 2.502 1.4501 1.1313-1.8719-2.5021-1.4501zm-2.766-10.309c1.2239 2.3219 1.1723 5.1155-0.13533 7.3897l1.9356 1.0673c1.6749-2.913 1.7401-6.4825 0.17355-9.4547zm-0.13582 7.3906c-1.3048 2.274-3.6734 3.7004-6.2595 3.7964l0.084109 2.1736c3.3764-0.12529 6.4375-1.9862 8.1118-4.9044zm1.3881-6.8333c2.2283-0.53699 4.5782-0.19386 6.5653 0.96218l1.1344-1.87c-2.4854-1.4459-5.4329-1.8785-8.2306-1.2043zm6.1647-0.50635-10.106 17.581 1.9356 1.067 10.106-17.581zm-8.574 17.178c-1.9906-1.1509-3.4722-3.0309-4.1294-5.2572l-2.1338 0.60397c0.81154 2.7492 2.6463 5.088 5.1339 6.5263zm14.134-11.842c-3.3764 0.12529-6.4375 1.9861-8.1118 4.9042l1.9364 1.0655c1.3047-2.2739 3.6734-3.7002 6.2595-3.7962zm-8.1112 4.9034c-1.6757 2.9133-1.7408 6.4838-0.1737 9.4562l1.9736-0.99781c-1.2243-2.3223-1.1728-5.1165 0.13534-7.391zm0.40174 1.4695 6.2515 3.6252 1.1318-1.8716-6.2515-3.6252z" />
          </>
        ),
      },
      {
        viewBox: "32",
        path: (
          <g transform="matrix(.97596 0 0 .95833 .75362 .81159)">
            <path d="m5 22c-2.9 0-5-1.3-5-3v-2c0-1.7 2.1-3 5-3s5 1.3 5 3v2c0 1.7-2.1 3-5 3z" />
            <path d="m21.8 10-6.2 13.5c-0.1 0.3-0.5 0.5-0.8 0.5h-9.3c-1.9 0-3.6 1.2-4.2 3l-0.4 1.1c-0.3 0.9-0.2 1.9 0.4 2.6 0.5 0.9 1.4 1.3 2.4 1.3h10.3c2.2 0 4.3-1.3 5.2-3.3l8.7-18.7z" />
            <path d="m28.8 8 2.3-4.9c0.4-0.7 0.3-1.5-0.1-2.1s-1.1-1-1.8-1h-1.4c-0.8 0-1.6 0.5-2 1.3l-3.1 6.7z" />
          </g>
        ),
      },
      {
        path: (
          <path d="M11.5697 12.5532L12.1617 13.0137V13.0137L11.5697 12.5532ZM11.3142 3.64586L12.0065 3.93432V3.93432L11.3142 3.64586ZM21.2426 10.7426L21.7773 10.2166L21.773 10.2123L21.2426 10.7426ZM21.4531 12.026C21.7436 12.3213 22.2184 12.3251 22.5137 12.0346C22.809 11.7442 22.8129 11.2693 22.5224 10.974L21.4531 12.026ZM5.7327 19.0428C5.31848 19.0428 4.9827 19.3786 4.9827 19.7928C4.9827 20.207 5.31848 20.5428 5.7327 20.5428V19.0428ZM3.5 15.75C3.08579 15.75 2.75 16.0858 2.75 16.5C2.75 16.9142 3.08579 17.25 3.5 17.25V15.75ZM8.19231 3.35575C8.35162 2.9734 8.17081 2.5343 7.78846 2.37498C7.40611 2.21567 6.96701 2.39648 6.80769 2.77883L8.19231 3.35575ZM19.876 16.916C20.1057 17.2607 20.5714 17.3538 20.916 17.124C21.2607 16.8943 21.3538 16.4286 21.124 16.084L19.876 16.916ZM5.85306 12.1446C5.93291 12.551 6.32712 12.8158 6.73357 12.7359C7.14001 12.6561 7.40477 12.2619 7.32492 11.8554L5.85306 12.1446ZM15.4334 17.3225C15.7715 17.0831 15.8515 16.615 15.6121 16.277C15.3727 15.9389 14.9046 15.8589 14.5666 16.0983L15.4334 17.3225ZM14.1553 6.08027C13.7501 5.99448 13.3521 6.25343 13.2663 6.65867C13.1805 7.0639 13.4394 7.46195 13.8447 7.54774L14.1553 6.08027ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 2.75C17.1086 2.75 21.25 6.89137 21.25 12H22.75C22.75 6.06294 17.9371 1.25 12 1.25V2.75ZM12 1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75C2.75 6.89137 6.89137 2.75 12 2.75V1.25ZM12 12.75H12.0917V11.25H12V12.75ZM11.408 11.5395L10.9777 12.0928L12.1617 13.0137L12.592 12.4605L11.408 11.5395ZM11.3077 1.71154L10.6219 3.35739L12.0065 3.93432L12.6923 2.28846L11.3077 1.71154ZM20.708 11.2686L21.4531 12.026L22.5224 10.974L21.7773 10.2167L20.708 11.2686ZM10.6219 3.35739C9.39039 6.31308 9.66695 9.68222 11.364 12.3975L12.636 11.6025C11.1965 9.29929 10.9619 6.44145 12.0065 3.93432L10.6219 3.35739ZM10.9777 12.0928C9.18293 14.4003 6.42334 15.75 3.5 15.75V17.25C6.88622 17.25 10.0828 15.6866 12.1617 13.0137L10.9777 12.0928ZM12.0917 12.75C15.2197 12.75 18.1408 14.3133 19.876 16.916L21.124 16.084C19.1107 13.064 15.7213 11.25 12.0917 11.25V12.75ZM6.80769 2.77883C5.55819 5.77764 5.23917 9.01982 5.85306 12.1446L7.32492 11.8554C6.76831 9.0222 7.05663 6.08137 8.19231 3.35575L6.80769 2.77883ZM14.5666 16.0983C11.9692 17.9377 8.82244 19.0428 5.7327 19.0428V20.5428C9.1695 20.5428 12.6141 19.319 15.4334 17.3225L14.5666 16.0983ZM13.8447 7.54774C16.4265 8.09437 18.8177 9.37835 20.7123 11.273L21.773 10.2123C19.6714 8.11074 17.0191 6.68657 14.1553 6.08027L13.8447 7.54774Z" />
        ),
      },
      {
        viewBox: "20",
        path: (
          <g transform="translate(-260 -4759)">
            <path
              transform="translate(56 160)"
              d="m206 4609c0-2.079 0.804-3.969 2.108-5.393-0.064 0.457-0.108 0.919-0.108 1.393 0 5.523 4.477 10 10 10 0.474 0 0.936-0.044 1.393-0.108-1.424 1.304-3.314 2.108-5.393 2.108-4.411 0-8-3.589-8-8m15.192 3.481c-0.064-0.024-0.129-0.044-0.192-0.07-2.928-1.19-5-4.061-5-7.411 0-1.249 0.296-2.427 0.808-3.481 3.028 1.14 5.192 4.059 5.192 7.481 0 1.172-0.259 2.282-0.714 3.286-0.03 0.066-0.063 0.13-0.094 0.195m-6.374-11.439c-0.525 1.214-0.818 2.552-0.818 3.958 0 3.276 1.583 6 4.017 8h-0.017c-4.411 0-8-3.589-8-8 0-1.172 0.26-2.282 0.714-3.286 1.004-0.455 2.114-0.714 3.286-0.714 0.276 0 0.549 0.014 0.818 0.042m-10.818 7.958c0 5.523 4.477 10 10 10 3.35 0 6.308-1.653 8.123-4.182 0.238-0.332 0.463-0.674 0.66-1.035 0.146-0.267 0.278-0.543 0.399-0.825 0.348-0.805 0.584-1.667 0.71-2.565 0.064-0.457 0.108-0.919 0.108-1.393 0-4.128-2.502-7.669-6.07-9.196-0.651-0.279-1.339-0.486-2.053-0.622-0.608-0.116-1.235-0.182-1.877-0.182-0.474 0-0.936 0.044-1.393 0.108-1.212 0.17-2.358 0.546-3.39 1.109-3.108 1.696-5.217 4.993-5.217 8.783"
            />
          </g>
        ),
      },
      {
        viewBox: "512",
        path: (
          <g transform="matrix(1 0 0 1.2654 0 -64.696)">
            <path d="m485.61 188.85c-25.472-11.892-46.128-16.635-52.926-23.064-6.798-6.437-3.932-23.072-13.859-22.802-9.927 0.262-18.51 15.029-17.822 22.646 0.655 7.371 20.771 22.146 20.771 22.146l-31.828-10.91s-3.211-21.107-0.704-26.471c2.49-5.365 20.918-34.318-10.025-52.034-30.927-17.707-62.493 14.923-51.223 64.294 0 0-56.677-2.458-82.476-7.552-9.73-1.925-71.224-20.1-79.971-25.816-8.764-5.717-20.394-19.313-33.171-26.914-12.794-7.601 3.915 23.064 14.923 37.987 3.489 6.536-2.358 5.046-13.285 4.84-7.387-0.139-8.174 9.656 9.076 11.18 12.17 1.064 34.514 3.03 34.514 3.03s36.054 19.23 55.154 24.26c26.553 6.994 54.204 7.813 54.204 7.813-9.059 14.153-8.895 32.467-14.94 43.851-10.745 20.197-37.922 5.979-37.922 5.979s-74.647-36.889-80.626-38.052c-5.995-1.163-94.844-37.356-101.38-43.081-2.572-2.244 35.645-28.306 17.822-35.644-13.76-5.66-37.234 0.844-48.684 18.371-11.434 17.523-26.373 28.514-19.492 38.261 6.88 9.746 19.493 10.729 24.145 11.27 7.306 0.835 77.939 48.593 105.05 59.118 20.738 8.043 91.094 57.628 91.094 57.628 10.893 4.636 48.192 43.72 48.192 43.72s-44.67-4.03-51.992-5.816c-7.338-1.793-30.288-30.468-35.743-36.283-5.455-5.807-13.875 1.704-11.712 7.592-2.424 8.674-6.683 28.331 5.472 37.266s36.251 24.678 36.251 24.678 73.828 31.632 104.16 37.52c31.451 6.102 56.678-31.934 38.331-64.597-11.827-21.034-14.84-40.821-14.84-40.821s30.844-16.217 66.326-63.361c26.995-5.357 88.62-3.538 100.15-17.757 11.528-14.218 4.468-30.574-21.02-42.475z" />
          </g>
        ),
      },
      {
        viewBox: "1024",
        path: (
          <g transform="matrix(1.0717 0 0 1.0714 -37.981 -39.818)">
            <path d="m512 960a448 448 0 1 1 0-896 448 448 0 0 1 0 896zm0-64a384 384 0 1 0 0-768 384 384 0 0 0 0 768z" />
            <path d="m186.82 268.29c16-16.384 31.616-31.744 46.976-46.08 17.472 30.656 39.808 58.112 65.984 81.28l-32.512 56.448a385.98 385.98 0 0 1-80.448-91.648zm653.7-5.312a385.92 385.92 0 0 1-83.776 96.96l-32.512-56.384a322.92 322.92 0 0 0 68.48-85.76c15.552 14.08 31.488 29.12 47.808 45.184zm-374.53 182.27 11.136-63.104a323.58 323.58 0 0 0 69.76 0l11.136 63.104a387.97 387.97 0 0 1-92.032 0zm-62.72-12.8a381.82 381.82 0 0 1-83.264-35.904l32-55.424a319.88 319.88 0 0 0 62.464 27.712l-11.2 63.488zm300.8-35.84a381.82 381.82 0 0 1-83.328 35.84l-11.2-63.552a319.88 319.88 0 0 0 62.464-27.712l32 55.424zm-520.77 364.8a385.92 385.92 0 0 1 83.968-97.28l32.512 56.32c-26.88 23.936-49.856 52.352-67.52 84.032-16-13.44-32.32-27.712-48.96-43.072zm657.54 0.128a1442.8 1442.8 0 0 1-49.024 43.072 321.41 321.41 0 0 0-67.584-84.16l32.512-56.32c33.216 27.456 61.696 60.352 84.096 97.408zm-374.91-182.78a387.97 387.97 0 0 1 92.032 0l-11.136 63.104a323.58 323.58 0 0 0-69.76 0zm-62.72 12.8 11.2 63.552a319.88 319.88 0 0 0-62.464 27.712l-31.936-55.424a381.82 381.82 0 0 1 83.264-35.84zm300.8 35.84-32 55.424a318.27 318.27 0 0 0-62.528-27.712l11.2-63.488c29.44 8.64 57.28 20.736 83.264 35.776z" />
          </g>
        ),
      },
    ]
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {path}
    </svg>
  );
}

export default Svg;
