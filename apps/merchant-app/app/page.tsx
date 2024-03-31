
import { Card } from "@repo/ui/card";
import styles from "./page.module.css";


export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <div className="text-3xl">Hello</div>
      <Card/>
    </main>
  );
}
