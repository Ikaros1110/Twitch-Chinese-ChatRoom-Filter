# Interaction Spec

## Safe

- no lock countdown is active,
- no warning indicator is shown,
- default input appearance remains,
- sending works normally.

## Warning

- input receives warning styling,
- indicator names the triggered rule,
- send is blocked,
- user must hold Enter continuously for the warning duration.

## Violation

- input receives violation styling,
- indicator names the triggered rule,
- send is blocked,
- user must hold Enter continuously for the violation duration.

## Hold-to-Send

- releasing Enter resets progress,
- editing the message resets progress,
- changing severity resets progress,
- remaining time updates continuously while Enter is held,
- status text disappears immediately when unlocked or reset.
