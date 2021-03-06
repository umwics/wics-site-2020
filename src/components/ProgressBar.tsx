import { Router } from "next/router";
import NProgress, { NProgressOptions } from "nprogress";
import React, { useEffect } from "react";

interface Props {
    color?: string;
    options?: Partial<NProgressOptions>;
}

const ProgressBar: React.FC<Props> = ({ options, color }: Props) => {
    const routeChangeStart = () => {
        NProgress.start();
    };

    const routeChangeEnd = () => {
        NProgress.done();
    };

    useEffect(() => {
        options && NProgress.configure(options);

        Router.events.on("routeChangeStart", routeChangeStart);
        Router.events.on("routeChangeComplete", routeChangeEnd);
        Router.events.on("routeChangeError", routeChangeEnd);

        return () => {
            Router.events.off("routeChangeStart", routeChangeStart);
            Router.events.off("routeChangeComplete", routeChangeEnd);
            Router.events.off("routeChangeError", routeChangeEnd);

            NProgress.remove();
        };
    }, []);

    return (
        <style jsx global>{`
            /* Make clicks pass-through */
            #nprogress {
                pointer-events: none;
            }

            #nprogress .bar {
                background: ${color ? color : "#29d"};

                position: fixed;
                z-index: 99999;
                top: 0;
                left: 0;

                width: 100%;
                height: 2px;
            }

            /* Fancy blur effect */
            #nprogress .peg {
                display: block;
                position: absolute;
                right: 0px;
                width: 100px;
                height: 100%;
                box-shadow: 0 0 10px #29d, 0 0 5px #29d;
                opacity: 1;

                -webkit-transform: rotate(3deg) translate(0px, -4px);
                -ms-transform: rotate(3deg) translate(0px, -4px);
                transform: rotate(3deg) translate(0px, -4px);
            }

            /* Remove these to get rid of the spinner */
            #nprogress .spinner {
                display: block;
                position: fixed;
                z-index: 99999;
                top: 15px;
                right: 15px;
            }

            #nprogress .spinner-icon {
                width: 18px;
                height: 18px;
                box-sizing: border-box;

                border: solid 2px transparent;
                border-top-color: #29d;
                border-left-color: #29d;
                border-radius: 50%;

                -webkit-animation: nprogress-spinner 400ms linear infinite;
                animation: nprogress-spinner 400ms linear infinite;
            }

            .nprogress-custom-parent {
                overflow: hidden;
                position: relative;
            }

            .nprogress-custom-parent #nprogress .spinner,
            .nprogress-custom-parent #nprogress .bar {
                position: absolute;
            }

            @-webkit-keyframes nprogress-spinner {
                0% {
                    -webkit-transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                }
            }
            @keyframes nprogress-spinner {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `}</style>
    );
};

export default ProgressBar;
