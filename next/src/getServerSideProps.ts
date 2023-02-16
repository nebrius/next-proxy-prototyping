import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const props = context.req.bootstrap
  if (!props) {
    throw new Error(`Internal error: missing sidecar data. This should not happen`);
  }
  return { props };
}