-- Students may read only the teacher assigned to their own student profile.
create policy "student read assigned teacher"
  on public.teachers for select
  using (
    id in (
      select teacher_id
      from public.students
      where students.id = auth.uid()
        and students.teacher_id is not null
    )
  );
