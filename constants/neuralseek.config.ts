interface NeuralSeekConfig {
    name: string;
    api_key: string;
    url_seek?: string;
    url_del_file?: string;
    url_explore_files?: string;
    url_maistro?: string;
    url_explore_upload?: string;
    url_explore_download?: string;
}

export const NEURALSEEK_URL_CONFIGS: NeuralSeekConfig[] = [
    {
        name: "customer-support-chatbot",
        api_key: "0c828089-d6359503-aea41b37-6f3d42fa",
        url_seek: "https://stagingapi.neuralseek.com/v1/customer-support-chatbot/seek"
    },
    {
        name: "staging-sftp-pii-demo",
        api_key: "1e971fcb-13812f6b-f1b3b9e5-1c093699",
        url_explore_upload: "https://stagingconsoleapi.neuralseek.com/sftp-pii/exploreUpload",
        url_maistro: "https://stagingapi.neuralseek.com/v1/sftp-pii/maistro",
        url_explore_download: "https://stagingconsoleapi.neuralseek.com/sftp-pii/maistro/octet-stream/${safeFileName}"
    },
    {
        name: "staging-doc-analyzer-demo",
        api_key: "49ba5f8f-c4d666a5-35081959-624dc6d5",
        url_explore_upload: "https://stagingconsoleapi.neuralseek.com/doc-analyzer/exploreUpload",
        url_maistro: "https://stagingapi.neuralseek.com/v1/doc-analyzer/maistro",
        url_seek: "https://stagingapi.neuralseek.com/v1/doc-analyzer/seek"
    },
    {
        name: "staging-bcbst-demo",
        api_key: "06615dda-2c297083-ccc263b9-c2a2ffaf",
        url_explore_upload: "https://stagingconsoleapi.neuralseek.com/bcbst-demo/exploreUpload",
        url_maistro: "https://stagingapi.neuralseek.com/v1/bcbst-demo/maistro",
        url_seek: "https://stagingapi.neuralseek.com/v1/bcbst-demo/seek"
    },
    {
        name: "staging-bank-instance",
        api_key: "754fb875-e0794f9d-e6b03a46-07f95776",
        url_maistro: "https://stagingapi.neuralseek.com/v1/bank-instance/maistro"
    },
    {
        name: "staging-testnew",
        api_key: "bbd04989-613cbbb9-553e52fb-d0cd4033",
        url_maistro: "https://stagingapi.neuralseek.com/v1/testnew/maistro"
    },
    {
        name: "staging-turing",
        api_key: "f5ca3423-1c27c087-b261f348-467ce701",
        url_maistro: "https://stagingapi.neuralseek.com/v1/turing/maistro"
    },
    {
        name: "staging-baycrest",
        api_key: "598063fe-d9682db0-634ac42c-67bea8bb",
        url_maistro: "https://stagingapi.neuralseek.com/v1/baycrest/maistro"
    },
    {
        name: "staging-exentec-demo",
        api_key: "cd25eca8-ac1a97c9-ded59613-045c4f90",
        url_maistro: "https://stagingapi.neuralseek.com/v1/exentec-demo/maistro",
        url_explore_upload: "https://stagingconsoleapi.neuralseek.com/exentec-demo/exploreUpload",
    },
    {
        name: "staging-derrick-law-demo",
        api_key: "f2d85bde-aa86902a-aea925ba-ca0bbb1e",
        url_maistro: "https://stagingapi.neuralseek.com/v1/derrick-law-demo/maistro",
        url_explore_upload: "https://stagingconsoleapi.neuralseek.com/derrick-law-demo/exploreUpload"
    },
    {
        name: "staging-SEC-demo",
        api_key: "6c5aca86-d343615d-60a44b29-c6dbb084",
        url_maistro: "https://stagingapi.neuralseek.com/v1/SEC-demo/maistro",
        url_explore_upload: "https://stagingconsoleapi.neuralseek.com/SEC-demo/exploreUpload",
    },
    {
        name: "staging-pii-detection-demo",
        api_key: "cb04b8cf-4f808510-eb1f4890-817d2c15",
        url_maistro: "https://stagingapi.neuralseek.com/v1/pii-detection-demo/maistro",
        url_explore_upload: "https://stagingconsoleapi.neuralseek.com/pii-detection-demo/exploreUpload",
        url_explore_download: "https://stagingconsoleapi.neuralseek.com/sftp-pii/maistro/octet-stream/${safeFileName}"
    },
    {
        name: "staging-agent-runner",
        api_key: "26a38846-f24dbfce-ea622343-25dad915",
        url_del_file: "https://stagingconsoleapi.neuralseek.com/agent-runner/fdel",
        url_explore_files: "https://stagingconsoleapi.neuralseek.com/agent-runner/exploreFiles",
        url_maistro: "https://stagingapi.neuralseek.com/v1/agent-runner/maistro",
        url_explore_upload: "https://stagingconsoleapi.neuralseek.com/agent-runner/exploreUpload",
    },
    {
        name: "chart_gen",
        api_key: "0095ac12-497e787e-49d533b3-7ba5c689",
        url_maistro: "https://stagingapi.neuralseek.com/v1/chart_gen/maistro"
    },
    {
        name: "customized-troubleshooter",
        api_key: "44979882-b9fced28-66d50eb0-1892e5cb",
        url_maistro: "https://stagingapi.neuralseek.com/v1/CustomizedTroubleshooter/maistro",
        url_seek: "https://stagingapi.neuralseek.com/v1/CustomizedTroubleshooter/seek"
    },
    {
        name: "NS-ES-V2",
        api_key: "e907252c-a14c702d-a0ae2b3b-490872cd",
        url_maistro: "https://stagingapi.neuralseek.com/v1/NS-ES-V2/maistro/"
    },
    {
        name: "staging-agreement-analyzer",
        api_key: "fee077c0-ffe0bb77-6cb03c92-cdb6688a",
        url_maistro: "https://stagingapi.neuralseek.com/v1/amalgamated-bank/maistro",
        url_seek: "https://stagingapi.neuralseek.com/v1/amalgamated-bank/seek"
    },
    {
        name: "doc-query",
        api_key: "a1546de3-7c9de1d1-199b588e-c989f680",
        url_maistro: "https://stagingapi.neuralseek.com/v1/leon-agent-running/maistro"
    },
    {
        name: "staging-brou-demo",
        api_key: "4a6ba3c5-27646d7f-8ec021b9-75f81900",
        url_seek: "https://stagingapi.neuralseek.com/v1/brou-poc/seek"
    },
    {
        name: "partsPicker",
        api_key: "97d7631c-d2f23b94-8ac5c65d-02c92419",
        url_seek: "https://stagingapi.neuralseek.com/v1/partsPicker/seek"
    },
    {
        name: "kyc-demo",
        url_maistro: "https://stagingapi.neuralseek.com/v1/kyc_demo/maistro",
        api_key: "5775bc8b-e250ba55-4f7e0453-44c0baa1"
    }
]